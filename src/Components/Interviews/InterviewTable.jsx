import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import StatusBadge from '../Shared/StatusBadge';
import SkillChipsDisplay from '../Shared/SkillChipsDisplay';
import { ACTIVE_STATUS_ORDER, STATUS_META, getStatusLabel } from '../../statusConfig';
import { formatRelativeTime } from '../../utils/interviewUtils';

function RowActions({ interview, variant, onView, onEdit, onDecline, onActivate, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }}>
      <Tooltip title="View">
        <IconButton size="small" aria-label={`View ${interview.companyName}`} onClick={() => onView?.(interview)}>
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {variant === 'active' && (
        <>
          <Tooltip title="Edit">
            <IconButton size="small" aria-label={`Edit ${interview.companyName}`} onClick={() => onEdit?.(interview)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton size="small" aria-label="More actions" onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                onDecline?.(interview);
              }}
            >
              Decline
            </MenuItem>
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

      {variant === 'uncracked' && (
        <>
          <Tooltip title="Activate">
            <IconButton size="small" aria-label={`Activate ${interview.companyName}`} onClick={() => onActivate?.(interview)}>
              <ReplayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" aria-label={`Delete ${interview.companyName}`} onClick={() => onDelete?.(interview)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}

export default function InterviewTable({
  interviews,
  variant = 'active',
  onView,
  onEdit,
  onDecline,
  onActivate,
  onDelete,
  onQuickStatusChange,
}) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
      <Table size="small" sx={{ minWidth: 760 }} aria-label="Interviews table">
        <TableHead>
          <TableRow>
            <TableCell>Company &amp; Position</TableCell>
            <TableCell>Status{variant === 'uncracked' ? ' / Was' : ''}</TableCell>
            <TableCell>HR / Contact</TableCell>
            <TableCell>Skills</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id} hover>
              <TableCell sx={{ maxWidth: 220 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {interview.companyName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {interview.position}
                </Typography>
              </TableCell>

              <TableCell sx={{ minWidth: 168 }}>
                {variant === 'active' ? (
                  <Select
                    value={interview.initialStatus}
                    onChange={(e) => onQuickStatusChange?.(interview.id, e.target.value)}
                    size="small"
                    aria-label={`Change status for ${interview.companyName}`}
                    sx={{ fontSize: '0.8rem', minWidth: 160 }}
                  >
                    {ACTIVE_STATUS_ORDER.map((status) => (
                      <MenuItem key={status} value={status}>
                        {STATUS_META[status].label}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Box>
                    <StatusBadge status={interview.initialStatus} />
                    {interview.previousStatus !== undefined && (
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Was: {getStatusLabel(interview.previousStatus)}
                      </Typography>
                    )}
                  </Box>
                )}
              </TableCell>

              <TableCell sx={{ minWidth: 180 }}>
                {interview.contactName && (
                  <Typography variant="body2" noWrap>
                    {interview.contactName}
                  </Typography>
                )}
                {interview.contactNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {interview.contactNumber}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Call contact"
                      onClick={() => (window.location.href = `tel:${interview.contactNumber}`)}
                    >
                      <PhoneIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Message on WhatsApp"
                      onClick={() => {
                        const digits = String(interview.contactNumber || '').replace(/\D/g, '');
                        if (digits) window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                )}
                {interview.contactEmail && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140 }}>
                      {interview.contactEmail}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Email contact"
                      onClick={() => (window.location.href = `mailto:${interview.contactEmail}`)}
                    >
                      <EmailOutlinedIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  </Box>
                )}
                {!interview.contactName && !interview.contactNumber && !interview.contactEmail && (
                  <Typography variant="caption" color="text.secondary">
                    —
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={{ maxWidth: 220 }}>
                <SkillChipsDisplay skills={interview.skills} max={3} />
              </TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Typography variant="caption" color="text.secondary">
                  {formatRelativeTime(interview)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <RowActions
                  interview={interview}
                  variant={variant}
                  onView={onView}
                  onEdit={onEdit}
                  onDecline={onDecline}
                  onActivate={onActivate}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
