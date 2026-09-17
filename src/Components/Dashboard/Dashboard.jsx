import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import StatCard from './StatCard';
import StatusBadge from '../Shared/StatusBadge';
import CommonSkeleton from '../Skelton';
import ErrorState from '../Shared/ErrorState';
import EmptyState from '../Shared/EmptyState';
import { fetchInterviewsFromFirestore } from '../../Redux/formSlice';
import {
  ACTIVE_STATUS_ORDER,
  STATUS,
  getStatusLabel,
  isActiveStage,
  isCrackedStatus,
  isUncrackedStatus,
} from '../../statusConfig';
import { formatRelativeTime } from '../../utils/interviewUtils';

export default function Dashboard({ onNavigate }) {
  const dispatch = useDispatch();
  const { interviewList, fetchStatus } = useSelector((state) => ({
    interviewList: state.form.interviewList,
    fetchStatus: state.form.fetchStatus,
  }));

  const stats = useMemo(() => {
    const total = interviewList.length;
    const active = interviewList.filter((i) => isActiveStage(i.initialStatus)).length;
    const cracked = interviewList.filter((i) => isCrackedStatus(i.initialStatus)).length;
    const uncracked = interviewList.filter((i) => isUncrackedStatus(i.initialStatus)).length;
    const inProgress = interviewList.filter((i) =>
      [STATUS.HR_ROUND, STATUS.TECHNICAL_ROUND, STATUS.MANAGEMENT_ROUND].includes(i.initialStatus),
    ).length;
    return { total, active, uncracked, cracked, inProgress };
  }, [interviewList]);

  const pipeline = useMemo(
    () =>
      ACTIVE_STATUS_ORDER.map((status) => ({
        status,
        label: getStatusLabel(status),
        count: interviewList.filter((i) => i.initialStatus === status).length,
      })),
    [interviewList],
  );

  const recent = useMemo(() => {
    return [...interviewList]
      .sort((a, b) => new Date(b.updatedAt || b.applicationDate || 0) - new Date(a.updatedAt || a.applicationDate || 0))
      .slice(0, 5);
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
        onAction={() => onNavigate?.('active')}
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
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Total Interviews" value={stats.total} icon={<Inventory2OutlinedIcon />} accentColor="#4f46e5" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Active" value={stats.active} icon={<WorkOutlineIcon />} accentColor="#4338CA" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="In Progress" value={stats.inProgress} icon={<TrendingUpIcon />} accentColor="#0F766E" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Cracked" value={stats.cracked} icon={<EmojiEventsOutlinedIcon />} accentColor="#15803D" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard label="Uncracked" value={stats.uncracked} icon={<HighlightOffIcon />} accentColor="#B91C1C" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Pipeline
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Applied → HR → Technical → Management
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
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Needs Your Attention
            </Typography>
            <Stack spacing={1.5} divider={<Box sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }} />}>
              {recent.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
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
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
