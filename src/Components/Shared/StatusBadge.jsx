import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { getStatusMeta } from '../../statusConfig';

export default function StatusBadge({ status, size = 'small', sx }) {
  const theme = useTheme();
  const meta = getStatusMeta(status);
  const palette = theme.palette.mode === 'dark' ? meta.dark : meta.light;

  return (
    <Chip
      label={meta.label}
      size={size}
      sx={{
        bgcolor: palette.bg,
        color: palette.color,
        border: 'none',
        ...sx,
      }}
    />
  );
}
