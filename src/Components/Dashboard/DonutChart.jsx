import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

const SIZE = 180;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

function highlight(e) {
  e.currentTarget.style.filter = 'brightness(1.12)';
}
function unhighlight(e) {
  e.currentTarget.style.filter = '';
}

// A donut in place of the old "Interview Status" progress list + "Status
// breakdown" stacked bar — one part-to-whole view of the pipeline instead of
// two redundant ones. Colors reuse STATUS_META's already-validated palette
// (see statusConfig.js), so no re-validation is needed here.
export default function DonutChart({ stages, total }) {
  const theme = useTheme();

  if (!total) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data yet.
      </Typography>
    );
  }

  const nonZero = stages.filter((s) => s.count > 0);
  const trackColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';

  let cumulative = 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
      <Box sx={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          style={{ transform: 'rotate(-90deg)' }}
          role="img"
          aria-label={`Status breakdown out of ${total}: ${stages.map((s) => `${s.label} ${s.count}`).join(', ')}`}
        >
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={trackColor} strokeWidth={STROKE} />
          {nonZero.map((stage) => {
            const pct = stage.count / total;
            const segLen = pct * CIRCUMFERENCE;
            const visibleLen = Math.max(segLen - GAP, 0);
            const offset = -(cumulative + GAP / 2);
            cumulative += segLen;
            return (
              <Tooltip key={stage.status} title={`${stage.label}: ${stage.count} (${Math.round(pct * 100)}%)`}>
                <circle
                  tabIndex={0}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={stage.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${visibleLen} ${CIRCUMFERENCE - visibleLen}`}
                  strokeDashoffset={offset}
                  style={{ outline: 'none', cursor: 'pointer', transition: 'filter 0.15s ease' }}
                  onMouseEnter={highlight}
                  onMouseLeave={unhighlight}
                  onFocus={highlight}
                  onBlur={unhighlight}
                />
              </Tooltip>
            );
          })}
        </svg>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1 }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, width: '100%' }}>
        {stages.map((stage) => (
          <Box key={stage.status} sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: stage.count > 0 ? 1 : 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: stage.color, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {stage.label}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {stage.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
