import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load your interviews. Please try again.',
  onRetry,
}) {
  return (
    <Box
      role="alert"
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.error.main}33`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(248,113,113,0.08)' : 'rgba(220,38,38,0.05)'),
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" startIcon={<RefreshIcon />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
}
