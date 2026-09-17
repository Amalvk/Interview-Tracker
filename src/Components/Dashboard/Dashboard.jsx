import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import StatCard from './StatCard';
import PipelineChart from './PipelineChart';
import StatusBadge from '../Shared/StatusBadge';
import CommonSkeleton from '../Skelton';
import ErrorState from '../Shared/ErrorState';
import EmptyState from '../Shared/EmptyState';
import InterviewDetailsDrawer from '../InterviewDetails/InterviewDetailsDrawer';
import InterviewFormModal from '../InterviewForm/InterviewFormModal';
import { fetchInterviewsFromFirestore } from '../../Redux/formSlice';
import {
  PIPELINE_STATUS_ORDER,
  STATUS,
  STATUS_META,
  getStatusLabel,
  isActiveStage,
  isCrackedStatus,
} from '../../statusConfig';
import { formatRelativeTime, sortByDefaultOrder } from '../../utils/interviewUtils';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviewList, fetchStatus } = useSelector((state) => ({
    interviewList: state.form.interviewList,
    fetchStatus: state.form.fetchStatus,
  }));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsInterview, setDetailsInterview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const openDetails = (interview) => {
    setDetailsInterview(interview);
    setDetailsOpen(true);
  };

  const openEditModal = (interview) => {
    setSelectedInterview(interview);
    setFormOpen(true);
    setDetailsOpen(false);
  };

  const stats = useMemo(() => {
    const total = interviewList.length;
    const active = interviewList.filter((i) => isActiveStage(i.initialStatus)).length;
    const cracked = interviewList.filter((i) => isCrackedStatus(i.initialStatus)).length;
    const noResponse = interviewList.filter((i) => i.initialStatus === STATUS.NO_RESPONSE).length;
    const inProgress = interviewList.filter((i) =>
      [STATUS.HR_ROUND, STATUS.TECHNICAL_ROUND, STATUS.MANAGEMENT_ROUND].includes(i.initialStatus),
    ).length;
    return { total, active, cracked, noResponse, inProgress };
  }, [interviewList]);

  const pipeline = useMemo(
    () =>
      PIPELINE_STATUS_ORDER.map((status) => ({
        status,
        label: getStatusLabel(status),
        count: interviewList.filter((i) => i.initialStatus === status).length,
        color: STATUS_META[status].solid,
      })),
    [interviewList],
  );

  const recent = useMemo(() => {
    const active = interviewList.filter((i) => isActiveStage(i.initialStatus));
    return sortByDefaultOrder(active).slice(0, 5);
  }, [interviewList]);

  if (fetchStatus === 'loading' && interviewList.length === 0) {
    return <CommonSkeleton />;
  }

  if (fetchStatus === 'failed' && interviewList.length === 0) {
    return <ErrorState onRetry={() => dispatch(fetchInterviewsFromFirestore())} />;
  }

  if (interviewList.length === 0) {
    return (
      <EmptyState
        title="No interviews yet"
        description="Start tracking your next opportunity by adding your first interview."
        actionLabel="+ Add Interview"
        onAction={() => navigate('/active')}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h5">Overview</Typography>
        <Typography variant="body2" color="text.secondary">
          A quick snapshot of where every opportunity currently stands.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Total Interviews" value={stats.total} icon={<Inventory2OutlinedIcon />} accentColor="#16A34A" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Active" value={stats.active} icon={<WorkOutlineIcon />} accentColor="#059669" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="In Progress" value={stats.inProgress} icon={<TrendingUpIcon />} accentColor="#0F766E" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Cracked" value={stats.cracked} icon={<EmojiEventsOutlinedIcon />} accentColor="#15803D" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="No Response" value={stats.noResponse} icon={<ScheduleOutlinedIcon />} accentColor="#CA8A04" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 0 } }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 0.5 }}>
              Pipeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              HR → Technical → Management → No Response
            </Typography>
            <Stack spacing={1.75}>
              {pipeline.map((stage) => (
                <Box key={stage.status}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{stage.label}</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stage.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.total ? (stage.count / stats.total) * 100 : 0}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'),
                      '& .MuiLinearProgress-bar': { bgcolor: stage.color },
                    }}
                  />
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Status breakdown
            </Typography>
            <PipelineChart stages={pipeline} total={stats.total} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 0 } }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 0.5 }}>
              Needs Your Attention
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Interviews still in HR, Technical, or Management round.
            </Typography>
            {recent.length ? (
              <Stack spacing={1.5} divider={<Box sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }} />}>
                {recent.map((item) => (
                  <Box
                    key={item.id}
                    onClick={() => openDetails(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDetails(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${item.companyName}`}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      borderRadius: 1,
                      mx: -1,
                      px: 1,
                      py: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {item.companyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {item.position} · {formatRelativeTime(item)}
                      </Typography>
                    </Box>
                    <StatusBadge status={item.initialStatus} />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nothing needs attention right now.
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

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
    </Box>
  );
}
