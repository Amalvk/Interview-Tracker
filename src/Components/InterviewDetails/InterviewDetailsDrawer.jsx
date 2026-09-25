import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { format } from 'date-fns';
import StatusBadge from '../Shared/StatusBadge';
import PhoneAction from '../Shared/PhoneAction';
import { getStatusLabel } from '../../statusConfig';
import { PLATFORM_OPTIONS } from '../InterviewForm/validation';

function getPlatformLabel(interview) {
  if (interview.platform === 'others') {
    return interview.platformOther ? `Others - ${interview.platformOther}` : 'Others';
  }
  return PLATFORM_OPTIONS.find((opt) => opt.value === interview.platform)?.label || interview.platform;
}

// A slim, unobtrusive scrollbar instead of the chunky OS default — used for
// both the drawer's outer scroll and the Timeline's own inner scroll so the
// two never compete visually.
const thinScrollbarSx = {
  scrollbarWidth: 'thin',
  scrollbarColor: (theme) =>
    `${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.18)'} transparent`,
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.18)'),
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.3)'),
  },
};

function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : format(d, 'MMM d, yyyy · h:mm a');
}

function buildTimeline(item) {
  const events = [];

  const notes = Array.isArray(item.commentList) ? item.commentList : [];
  if (notes.length) {
    notes.forEach((note) => {
      events.push({
        id: `note-${note.id}`,
        when: note.createdAt,
        label: note.text,
        kind: 'note',
      });
    });
  } else if (item.comments) {
    events.push({
      id: 'legacy-comment',
      when: item.createdAt || item.applicationDate,
      label: String(item.comments),
      kind: 'note',
    });
  }

  const createdAt = item.createdAt || item.applicationDate;
  events.push({
    id: 'created',
    when: createdAt,
    label: 'Interview added',
    kind: 'system',
  });

  if (item.updatedAt && item.updatedAt !== item.createdAt) {
    events.push({
      id: 'updated',
      when: item.updatedAt,
      label: `Status is currently "${getStatusLabel(item.initialStatus)}"`,
      kind: 'system',
    });
  }

  return events
    .filter((e) => e.when)
    .sort((a, b) => new Date(b.when) - new Date(a.when));
}

export default function InterviewDetailsDrawer({ open, onClose, interview, onEdit }) {
  if (!interview) return null;
  const timeline = buildTimeline(interview);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, height: '100%', overflowY: 'auto', ...thinScrollbarSx }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{interview.companyName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {interview.location || interview.position}
            </Typography>
          </Box>
          <IconButton aria-label="Close details" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box>
          <StatusBadge status={interview.initialStatus} />
        </Box>

        {interview.platform && (
          <Typography variant="body2" color="text.secondary">
            Platform: {getPlatformLabel(interview)}
          </Typography>
        )}

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Contact
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">{interview.contactName || 'Not provided'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              {interview.contactNumber ? (
                <PhoneAction phone={interview.contactNumber} />
              ) : (
                <Typography variant="body2">Not provided</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              {interview.contactEmail ? (
                <Typography
                  component="a"
                  href={`mailto:${interview.contactEmail}`}
                  variant="body2"
                  sx={{ color: 'primary.main', textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  {interview.contactEmail}
                </Typography>
              ) : (
                <Typography variant="body2">Not provided</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Timeline
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              height: 260,
              overflowY: 'auto',
              pr: 1,
              ...thinScrollbarSx,
            }}
          >
            {timeline.length ? (
              timeline.map((event) => (
                <Box key={event.id} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mt: 0.75,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {event.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatWhen(event.when)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No history yet.</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {onEdit && (
          <Button variant="contained" onClick={() => onEdit(interview)} fullWidth>
            Edit Interview
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
