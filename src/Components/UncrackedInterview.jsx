import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { deleteInterviewById, fetchInterviewsFromFirestore } from '../Redux/formSlice';
import InterviewCardItem from './Interviews/InterviewCardItem';
import InterviewDetailsDrawer from './InterviewDetails/InterviewDetailsDrawer';
import InterviewFormModal from './InterviewForm/InterviewFormModal';
import ConfirmWarningModal from './ConfirmWarningModal';
import SearchBar from './Shared/SearchBar';
import LabeledSelect from './Shared/LabeledSelect';
import DateSortToggle from './Shared/DateSortToggle';
import EmptyState from './Shared/EmptyState';
import ErrorState from './Shared/ErrorState';
import CommonSkeleton from './Skelton';
import { isUncrackedStatus } from '../statusConfig';
import { matchesSearch, sortInterviews } from '../utils/interviewUtils';

export default function UncrackedInterview() {
  const dispatch = useDispatch();

  const { interviewList, fetchStatus } = useSelector((state) => ({
    interviewList: state.form.interviewList.filter((item) => isUncrackedStatus(item.initialStatus)),
    fetchStatus: state.form.fetchStatus,
  }));

  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsInterview, setDetailsInterview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const companyOptions = useMemo(() => {
    const unique = Array.from(new Set(interviewList.map((i) => i.companyName).filter(Boolean)));
    return [{ value: 'all', label: 'All Companies' }, ...unique.map((c) => ({ value: c, label: c }))];
  }, [interviewList]);

  const filtered = useMemo(() => {
    let list = interviewList.filter((item) => matchesSearch(item, search));
    if (companyFilter !== 'all') {
      list = list.filter((item) => item.companyName === companyFilter);
    }
    return sortInterviews(list, sortDir);
  }, [interviewList, search, companyFilter, sortDir]);

  const openDetails = (interview) => {
    setDetailsInterview(interview);
    setDetailsOpen(true);
  };

  const openEditModal = (interview) => {
    setSelectedInterview(interview);
    setFormOpen(true);
    setDetailsOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteInterviewById({ nodeId: deleteTarget.id }));
    if (deleteInterviewById.fulfilled.match(result)) {
      dispatch(fetchInterviewsFromFirestore());
    }
    setDeleteTarget(null);
  };

  const hasAnyInterviews = interviewList.length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography variant="h5">Uncracked Interviews</Typography>
        <Typography variant="body2" color="text.secondary">
          Interviews that were declined or went unanswered — kept here for your application history.
        </Typography>
      </Box>

      {hasAnyInterviews && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search company, location, HR, skill…" />
          <LabeledSelect label="Company" value={companyFilter} onChange={setCompanyFilter} options={companyOptions} />
          <DateSortToggle direction={sortDir} onToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} />
        </Stack>
      )}

      {hasAnyInterviews && (
        <Typography variant="body2" color="text.secondary">
          {filtered.length} of {interviewList.length} interview{interviewList.length === 1 ? '' : 's'}
        </Typography>
      )}

      {fetchStatus === 'loading' && interviewList.length === 0 && <CommonSkeleton />}

      {fetchStatus === 'failed' && interviewList.length === 0 && (
        <ErrorState onRetry={() => dispatch(fetchInterviewsFromFirestore())} />
      )}

      {fetchStatus !== 'loading' && fetchStatus !== 'failed' && !hasAnyInterviews && (
        <EmptyState
          icon={<HighlightOffIcon sx={{ fontSize: 40 }} />}
          title="No uncracked interviews"
          description="Great! Your interview pipeline is clear."
        />
      )}

      {hasAnyInterviews && filtered.length === 0 && (
        <EmptyState title="No matching interviews" description="Try adjusting your search or filters." />
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {filtered.map((interview) => (
          <InterviewCardItem
            key={interview.id}
            interview={interview}
            onView={openDetails}
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />
        ))}
      </Box>

      <InterviewDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        interview={detailsInterview}
        onEdit={openEditModal}
      />

      <InterviewFormModal
        open={formOpen}
        mode="edit"
        interview={selectedInterview}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmWarningModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete interview?"
        message={
          deleteTarget
            ? `Are you sure you want to remove "${deleteTarget.companyName}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </Box>
  );
}
