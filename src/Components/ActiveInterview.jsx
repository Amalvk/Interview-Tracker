import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import { deleteInterviewById, fetchInterviewsFromFirestore } from '../Redux/formSlice';
import InterviewCardItem from './Interviews/InterviewCardItem';
import InterviewTable from './Interviews/InterviewTable';
import InterviewFormModal from './InterviewForm/InterviewFormModal';
import InterviewDetailsDrawer from './InterviewDetails/InterviewDetailsDrawer';
import ConfirmWarningModal from './ConfirmWarningModal';
import SearchBar from './Shared/SearchBar';
import LabeledSelect from './Shared/LabeledSelect';
import DateSortToggle from './Shared/DateSortToggle';
import EmptyState from './Shared/EmptyState';
import ErrorState from './Shared/ErrorState';
import CommonSkeleton from './Skelton';
import { ACTIVE_STATUS_ORDER, STATUS_META, isActiveStage } from '../statusConfig';
import { matchesSearch, sortByDefaultOrder, sortInterviews } from '../utils/interviewUtils';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  ...ACTIVE_STATUS_ORDER.map((status) => ({ value: status, label: STATUS_META[status].label })),
];

const VIEW_MODE_KEY = 'interview-tracker-active-view-mode';

function getInitialViewMode() {
  try {
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    if (stored === 'card' || stored === 'table') return stored;
  } catch {
    // ignore unavailable localStorage
  }
  return 'card';
}

export default function ActiveInterview() {
  const dispatch = useDispatch();

  const { interviewList, fetchStatus } = useSelector((state) => ({
    interviewList: state.form.interviewList.filter((item) => isActiveStage(item.initialStatus)),
    fetchStatus: state.form.fetchStatus,
  }));

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc');
  const [sortTouched, setSortTouched] = useState(false);
  const [viewMode, setViewMode] = useState(getInitialViewMode);

  const handleViewModeChange = (_, next) => {
    if (!next) return;
    setViewMode(next);
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, next);
    } catch {
      // ignore unavailable localStorage
    }
  };

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsInterview, setDetailsInterview] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let list = interviewList.filter((item) => matchesSearch(item, search));
    if (statusFilter !== 'all') {
      list = list.filter((item) => item.initialStatus === statusFilter);
    }
    return sortTouched ? sortInterviews(list, sortDir) : sortByDefaultOrder(list);
  }, [interviewList, search, statusFilter, sortDir, sortTouched]);

  const openAddModal = () => {
    setFormMode('add');
    setSelectedInterview(null);
    setFormOpen(true);
  };

  const openEditModal = (interview) => {
    setFormMode('edit');
    setSelectedInterview(interview);
    setFormOpen(true);
    setDetailsOpen(false);
  };

  const openDetails = (interview) => {
    setDetailsInterview(interview);
    setDetailsOpen(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5">Active Interviews</Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your ongoing interview opportunities.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal} sx={{ height: 'fit-content' }}>
          Add Interview
        </Button>
      </Box>

      {hasAnyInterviews && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search company, position, HR, skill…" />
          <LabeledSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTER_OPTIONS} />
          <DateSortToggle
            direction={sortDir}
            onToggle={() => {
              setSortTouched(true);
              setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            }}
          />
        </Stack>
      )}

      {hasAnyInterviews && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} of {interviewList.length} interview{interviewList.length === 1 ? '' : 's'}
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            aria-label="Choose list layout"
          >
            <ToggleButton value="card" aria-label="Card view">
              <Tooltip title="Card view">
                <ViewModuleOutlinedIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table" aria-label="Table view">
              <Tooltip title="Table view">
                <TableRowsOutlinedIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {fetchStatus === 'loading' && interviewList.length === 0 && <CommonSkeleton />}

      {fetchStatus === 'failed' && interviewList.length === 0 && (
        <ErrorState onRetry={() => dispatch(fetchInterviewsFromFirestore())} />
      )}

      {fetchStatus !== 'loading' && fetchStatus !== 'failed' && !hasAnyInterviews && (
        <EmptyState
          icon={<WorkOutlineIcon sx={{ fontSize: 40 }} />}
          title="No Active Interviews"
          description="Start tracking your next opportunity by adding your first interview."
          actionLabel="+ Add Interview"
          onAction={openAddModal}
        />
      )}

      {hasAnyInterviews && filtered.length === 0 && (
        <EmptyState title="No matching interviews" description="Try adjusting your search or filters." />
      )}

      {filtered.length > 0 && viewMode === 'table' ? (
        <InterviewTable interviews={filtered} onView={openDetails} onEdit={openEditModal} onDelete={setDeleteTarget} />
      ) : (
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
      )}

      <InterviewFormModal
        open={formOpen}
        mode={formMode}
        interview={selectedInterview}
        onClose={() => setFormOpen(false)}
      />

      <InterviewDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        interview={detailsInterview}
        onEdit={openEditModal}
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
