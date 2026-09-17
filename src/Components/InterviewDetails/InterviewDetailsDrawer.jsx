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
import SkillChipsDisplay from '../Shared/SkillChipsDisplay';
import { skillsStringToArray } from '../Shared/SkillChipsInput';
import { getStatusLabel } from '../../statusConfig';

function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : format(d, 'MMM d, yyyy · h:mm a');
}

function buildTimeline(item) {
  const events = [];

  const notes = Array.isArray(item.commentList) ? item.commentList : [];
  notes.forEach((note) => {
    events.push({
      id: `note-${note.id}`,
      when: note.createdAt,
      label: note.text,
      kind: 'note',
    });
  });

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
  const skills = skillsStringToArray(interview.skills);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, height: '100%', overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6">{interview.companyName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {interview.position}
            </Typography>
          </Box>
          <IconButton aria-label="Close details" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box>
          <StatusBadge status={interview.initialStatus} />
        </Box>

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
              <Typography variant="body2">{interview.contactNumber || 'Not provided'}</Typography>
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
            Skills
          </Typography>
          <Box sx={{ mt: 1 }}>
            {skills.length ? <SkillChipsDisplay skills={interview.skills} /> : (
              <Typography variant="body2" color="text.secondary">No skills listed.</Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Comments
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Array.isArray(interview.commentList) && interview.commentList.length ? (
              [...interview.commentList]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((c) => (
                  <Box key={c.id} sx={{ pl: 1.5, borderLeft: (theme) => `2px solid ${theme.palette.divider}` }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatWhen(c.createdAt)}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {c.text}
                    </Typography>
                  </Box>
                ))
            ) : interview.comments ? (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {interview.comments}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
            )}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">
            Timeline
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
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
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatWhen(event.when)}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {event.label}
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
