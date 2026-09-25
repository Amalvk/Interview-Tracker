import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StatCard from './StatCard';
import DonutChart from './DonutChart';
import PlatformBar from './PlatformBar';
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
import { PLATFORM_OPTIONS } from '../InterviewForm/validation';
import { formatRelativeTime, sortByDefaultOrder } from '../../utils/interviewUtils';

// Single mode-invariant hex per platform (same approach as STATUS_META.solid)
// — validated with the dataviz palette script for both light (#fcfcfb) and
// dark (#1a1a19) chart surfaces, adjacent-pair CVD/normal-vision checks.
const PLATFORM_COLORS = {
  naukri: '#3987e5',
  indeed: '#d95926',
  linkedin: '#199e70',
  gmail: '#c98500',
  portal: '#d55181',
  others: '#008300',
};

const PREP_RESOURCES = [
  {
    label: 'Interview Preparation Notes',
    description: 'Personal drive doc with interview prep material and references.',
    url: 'https://docs.google.com/document/d/1W2u_jC-pxRqSqqO1wspzSiZm6sSuw5k3KoEoiO5NhLQ/edit?tab=t.810tvquqov17',
  },
];

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
    return { total, active, cracked, noResponse };
  }, [interviewList]);

  // On Hold is appended after the pipeline stages so the "Interview Status"
  // donut also reflects it, without reordering the validated pipeline order.
  const pipeline = useMemo(
    () =>
      [...PIPELINE_STATUS_ORDER, STATUS.ON_HOLD].map((status) => ({
        status,
        label: getStatusLabel(status),
        count: interviewList.filter((i) => i.initialStatus === status).length,
        color: STATUS_META[status].solid,
      })),
    [interviewList],
  );

  // The donut only plots the pipeline stages above (Cracked/Uncracked have
  // their own dedicated stat card and page) — so its center total and each
  // slice's percentage are relative to this sum, not the overall interview
  // count, or Uncracked would silently inflate the denominator.
  const pipelineTotal = useMemo(() => pipeline.reduce((sum, stage) => sum + stage.count, 0), [pipeline]);

  // Platform split: how interviews came in. Denominator is interviews with a
  // platform set (same pattern as pipelineTotal) so an unspecified platform
  // doesn't silently dilute the percentages.
  const platforms = useMemo(
    () =>
      PLATFORM_OPTIONS.map((option) => ({
        key: option.value,
        label: option.label,
        count: interviewList.filter((i) => i.platform === option.value).length,
        color: PLATFORM_COLORS[option.value],
      })),
    [interviewList],
  );
  const platformTotal = useMemo(() => platforms.reduce((sum, p) => sum + p.count, 0), [platforms]);

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
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard label="Total Interviews" value={stats.total} icon={<Inventory2OutlinedIcon />} accentColor="#16A34A" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard label="Active" value={stats.active} icon={<WorkOutlineIcon />} accentColor="#059669" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard label="Cracked" value={stats.cracked} icon={<EmojiEventsOutlinedIcon />} accentColor="#15803D" />
        </Grid>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <StatCard label="No Response" value={stats.noResponse} icon={<ScheduleOutlinedIcon />} accentColor="#CA8A04" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 2, md: 0 } }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 0.5 }}>
              Interview Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get a quick overview of your current interview stages.
            </Typography>
            <DonutChart stages={pipeline} total={pipelineTotal} />

            <Box sx={{ mt: 3, pt: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
                Platform Split
              </Typography>
              <PlatformBar platforms={platforms} total={platformTotal} />
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ order: { xs: 1, md: 0 } }}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 0.5 }}>
              Recent Interviews
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your latest interview opportunities and status updates.
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
                        {item.location || item.position} · {formatRelativeTime(item)}
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

      <Card sx={{ p: 2.5 }}>
        <Typography variant="h6" color="primary.main" sx={{ mb: 0.5 }}>
          Preparation Resources
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Quick reference material to help you prepare for upcoming interviews.
        </Typography>
        <Stack spacing={1.5}>
          {PREP_RESOURCES.map((resource) => (
            <Link
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                color: 'text.primary',
                '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
              }}
            >
              <DescriptionOutlinedIcon color="primary" />
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {resource.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {resource.description}
                </Typography>
              </Box>
              <OpenInNewIcon fontSize="small" color="action" />
            </Link>
          ))}
        </Stack>
      </Card>

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
