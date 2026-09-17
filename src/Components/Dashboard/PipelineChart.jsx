import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

// A single 100%-stacked bar: part-to-whole by status, colored with the
// validated status palette (see statusConfig.js). Segments carry no inline
// number (most are too narrow to hold one) — the legend below and each
// segment's tooltip/focus readout carry the value instead.
export default function PipelineChart({ stages, total }) {
  const nonZero = stages.filter((s) => s.count > 0);

  if (!total) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data yet.
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        role="img"
        aria-label={`Status breakdown out of ${total}: ${stages.map((s) => `${s.label} ${s.count}`).join(', ')}`}
        sx={{
          display: 'flex',
          width: '100%',
          height: 28,
          borderRadius: '6px',
          overflow: 'hidden',
          gap: '2px',
        }}
      >
        {nonZero.map((stage) => {
          const pct = (stage.count / total) * 100;
          return (
            <Tooltip key={stage.status} title={`${stage.label}: ${stage.count} (${Math.round(pct)}%)`}>
              <Box
                tabIndex={0}
                sx={{
                  width: `${pct}%`,
                  minWidth: 6,
                  bgcolor: stage.color,
                  outline: 'none',
                  transition: 'filter 0.15s ease',
                  '&:hover, &:focus-visible': { filter: 'brightness(1.12)' },
                }}
              />
            </Tooltip>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5 }}>
        {stages.map((stage) => (
          <Box
            key={stage.status}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, opacity: stage.count > 0 ? 1 : 0.5 }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: stage.color, flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary">
              {stage.label} ({stage.count})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
