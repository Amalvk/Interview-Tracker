import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Divider from '@mui/material/Divider';
import StatusBadge from '../Shared/StatusBadge';
import SkillChipsDisplay from '../Shared/SkillChipsDisplay';
import { ACTIVE_STATUS_ORDER, STATUS_META, getStatusLabel } from '../../statusConfig';
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

export default function InterviewCardItem({
  interview,
  variant = 'active',
  onView,
  onEdit,
  onDecline,
  onActivate,
  onDelete,
  onQuickStatusChange,
  onMarkCracked,
  onMarkNoResponse,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const notes = getNotesForDisplay(interview);

  const handleCall = (e) => {
    e.stopPropagation();
    if (interview.contactNumber) window.location.href = `tel:${interview.contactNumber}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const digits = String(interview.contactNumber || '').replace(/\D/g, '');
    if (digits) window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = (e) => {
    e.stopPropagation();
    if (interview.contactEmail) window.location.href = `mailto:${interview.contactEmail}`;
  };

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

        {variant === 'active' ? (
          <Select
            value={interview.initialStatus}
            onChange={(e) => {
              onQuickStatusChange?.(interview.id, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            aria-label="Change interview status"
            sx={{ fontSize: '0.8rem', minWidth: 168, flexShrink: 0 }}
          >
            {ACTIVE_STATUS_ORDER.map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_META[status].label}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <StatusBadge status={interview.initialStatus} />
            {interview.previousStatus !== undefined && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Was: {getStatusLabel(interview.previousStatus)}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {(interview.contactName || interview.contactNumber || interview.contactEmail) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {interview.contactName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">{interview.contactName}</Typography>
            </Box>
          )}
          {interview.contactNumber && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{interview.contactNumber}</Typography>
              <Tooltip title="Call">
                <IconButton size="small" aria-label="Call contact" onClick={handleCall}>
                  <PhoneIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="WhatsApp">
                <IconButton size="small" aria-label="Message on WhatsApp" onClick={handleWhatsApp}>
                  <WhatsAppIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          {interview.contactEmail && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                {interview.contactEmail}
              </Typography>
              <Tooltip title="Email">
                <IconButton size="small" aria-label="Email contact" onClick={handleEmail}>
                  <EmailOutlinedIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}

      <SkillChipsDisplay skills={interview.skills} max={6} />

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
          {variant === 'active' && (
            <>
              <Button size="small" startIcon={<EditOutlinedIcon fontSize="small" />} onClick={() => onEdit?.(interview)}>
                Edit
              </Button>
              <Tooltip title="More">
                <IconButton size="small" aria-label="More actions" onClick={(e) => setMenuAnchor(e.currentTarget)}>
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    onMarkCracked?.(interview);
                  }}
                >
                  <EmojiEventsOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                  Mark as Cracked
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    onMarkNoResponse?.(interview);
                  }}
                >
                  <HighlightOffIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                  No Response
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    onDecline?.(interview);
                  }}
                >
                  Decline
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setMenuAnchor(null);
                    onDelete?.(interview);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}

          {(variant === 'uncracked' || variant === 'cracked') && (
            <>
              <Button size="small" variant="outlined" onClick={() => onActivate?.(interview)}>
                {variant === 'cracked' ? 'Reopen' : 'Activate'}
              </Button>
              <Tooltip title="Delete">
                <IconButton size="small" aria-label="Delete interview" color="error" onClick={() => onDelete?.(interview)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}
