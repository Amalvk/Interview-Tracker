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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StatusBadge from '../Shared/StatusBadge';
import PhoneAction from '../Shared/PhoneAction';
import { formatRelativeTime } from '../../utils/interviewUtils';

function RowActions({ interview, onEdit, onDelete }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.25 }} onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Edit">
        <IconButton size="small" aria-label={`Edit ${interview.companyName}`} onClick={() => onEdit?.(interview)}>
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="error" aria-label={`Delete ${interview.companyName}`} onClick={() => onDelete?.(interview)}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function InterviewTable({ interviews, onView, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
      <Table size="small" sx={{ minWidth: 760 }} aria-label="Interviews table">
        <TableHead>
          <TableRow sx={{ '& th': { fontSize: { xs: '0.72rem', sm: '0.8125rem' }, whiteSpace: 'nowrap' } }}>
            <TableCell>Company &amp; Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>HR / Contact</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow
              key={interview.id}
              hover
              onClick={() => onView?.(interview)}
              sx={{
                cursor: 'pointer',
                '&:nth-of-type(odd)': {
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)'),
                },
              }}
            >
              <TableCell sx={{ maxWidth: 220 }}>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {interview.companyName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {interview.position}
                </Typography>
              </TableCell>

              <TableCell sx={{ minWidth: { xs: 108, sm: 168 }, py: { xs: 0.5, sm: 1 } }}>
                <StatusBadge status={interview.initialStatus} />
              </TableCell>

              <TableCell sx={{ minWidth: 180 }}>
                {interview.contactName && (
                  <Typography variant="body2" noWrap>
                    {interview.contactName}
                  </Typography>
                )}
                {interview.contactNumber && (
                  <PhoneAction phone={interview.contactNumber} variant="caption" sx={{ display: 'block' }} />
                )}
                {!interview.contactName && !interview.contactNumber && (
                  <Typography variant="caption" color="text.secondary">
                    —
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Typography variant="caption" color="text.secondary">
                  {formatRelativeTime(interview)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <RowActions interview={interview} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
