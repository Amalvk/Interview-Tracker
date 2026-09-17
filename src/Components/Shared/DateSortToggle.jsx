import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Sorting here is date-only, so a single icon toggling asc/desc replaces a
// field-picking dropdown.
export default function DateSortToggle({ direction, onToggle }) {
  const isDesc = direction === 'desc';

  return (
    <Tooltip title={isDesc ? 'Newest first — click for oldest first' : 'Oldest first — click for newest first'}>
      <IconButton
        size="small"
        aria-label={isDesc ? 'Sorted newest first, click to sort oldest first' : 'Sorted oldest first, click to sort newest first'}
        onClick={onToggle}
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {isDesc ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
