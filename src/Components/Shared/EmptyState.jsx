import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, sm: 8 },
        px: 3,
        borderRadius: 3,
        border: (theme) => `1px dashed ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', color: 'text.secondary' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 3 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
