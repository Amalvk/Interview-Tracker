import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StatusBadge from '../Shared/StatusBadge';
import PhoneAction from '../Shared/PhoneAction';
import { getStatusMeta } from '../../statusConfig';
import { formatRelativeTime } from '../../utils/interviewUtils';

function getNotesForDisplay({ commentList, comments }) {
  if (Array.isArray(commentList) && commentList.length) {
    return [...commentList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (comments) {
    return [{ id: 'legacy', text: String(comments), createdAt: null }];
  }
  return [];
}

export default function InterviewCardItem({ interview, onView, onEdit, onDelete }) {
  const notes = getNotesForDisplay(interview);
  const theme = useTheme();
  const statusPalette = theme.palette.mode === 'dark' ? getStatusMeta(interview.initialStatus).dark : getStatusMeta(interview.initialStatus).light;

  return (
    <Card
      onClick={() => onView?.(interview)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.(interview);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${interview.companyName}`}
      sx={{
        p: { xs: 2, sm: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        cursor: 'pointer',
        bgcolor: statusPalette.bg,
        borderLeft: `4px solid ${statusPalette.color}`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {interview.companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {interview.position}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
          <StatusBadge status={interview.initialStatus} />
        </Box>
      </Box>

      {(interview.contactName || interview.contactNumber || interview.contactEmail) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {interview.contactName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">{interview.contactName}</Typography>
            </Box>
          )}
          {interview.contactNumber && <PhoneAction phone={interview.contactNumber} />}
          {interview.contactEmail && (
            <Typography
              component="a"
              href={`mailto:${interview.contactEmail}`}
              onClick={(e) => e.stopPropagation()}
              variant="body2"
              noWrap
              sx={{ color: 'primary.main', textDecoration: 'none', maxWidth: 200 }}
            >
              {interview.contactEmail}
            </Typography>
          )}
        </Box>
      )}

      {notes.length > 0 && (
        <Box>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            Notes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
            {notes.slice(0, 2).map((n) => (
              <Typography
                key={n.id}
                variant="body2"
                sx={{
                  pl: 1,
                  borderLeft: (theme) => `2px solid ${theme.palette.divider}`,
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {n.text}
              </Typography>
            ))}
            {notes.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{notes.length - 2} more note{notes.length - 2 > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          pt: 0.5,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Last updated: {formatRelativeTime(interview)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
          <Button size="small" startIcon={<EditOutlinedIcon fontSize="small" />} onClick={() => onEdit?.(interview)}>
            Edit
          </Button>
          <Tooltip title="Delete">
            <IconButton size="small" aria-label="Delete interview" color="error" onClick={() => onDelete?.(interview)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
}
