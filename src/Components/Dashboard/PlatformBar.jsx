import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// Compact stand-in for a full donut/bar chart: a single proportional stacked
// bar plus a wrapping chip legend, sized to add one slim row to the
// Dashboard rather than another full-height chart card.
export default function PlatformBar({ platforms, total }) {
  const nonZero = platforms.filter((p) => p.count > 0);

  if (!total) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Box sx={{ display: 'flex', gap: '2px', height: 8, borderRadius: 999, overflow: 'hidden' }}>
        {nonZero.map((p) => {
          const pct = p.count / total;
          return (
            <Tooltip key={p.key} title={`${p.label}: ${p.count} (${Math.round(pct * 100)}%)`}>
              <Box
                tabIndex={0}
                sx={{
                  flexGrow: p.count,
                  bgcolor: p.color,
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'filter 0.15s ease',
                  '&:hover, &:focus': { filter: 'brightness(1.12)' },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>

      <Stack direction="row" flexWrap="wrap" columnGap={1.5} rowGap={0.25}>
        {nonZero.map((p) => (
          <Box key={p.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: p.color, flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary">
              {p.label} <Typography component="span" variant="caption" fontWeight={600} color="text.primary">{p.count}</Typography>
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
