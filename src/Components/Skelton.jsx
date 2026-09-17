import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function CommonSkeleton({ count = 4 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
        gap: 2,
      }}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ p: 2.5, borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rounded" height={20} width="80%" sx={{ my: 1 }} />
          <Skeleton variant="rounded" height={60} />
        </Box>
      ))}
    </Box>
  );
}
