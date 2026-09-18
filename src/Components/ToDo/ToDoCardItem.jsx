import { Draggable } from '@hello-pangea/dnd';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { TODO_STATUS, TODO_URGENCY_META, getTodoPriorityMeta } from '../../todoConfig';
import { formatDueDate, getDueMeta } from '../../utils/todoUtils';

function getAccent(todo, isDark) {
  const dueMeta = getDueMeta(todo);
  const urgency = TODO_URGENCY_META[dueMeta.kind];
  if (!urgency) return { solid: null, dueMeta };
  const palette = urgency[isDark ? 'dark' : 'light'];
  return { ...palette, solid: urgency.solid, dueMeta };
}

export default function ToDoCardItem({ todo, index, onEdit, onDelete }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = getAccent(todo, isDark);
  const isCompleted = todo.status === TODO_STATUS.COMPLETED;
  const isUrgent = accent.dueMeta.kind === 'overdue' || accent.dueMeta.kind === 'due-today';
  const priorityMeta = getTodoPriorityMeta(todo.priority);
  const priorityPalette = priorityMeta[isDark ? 'dark' : 'light'];

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit?.(todo)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEdit?.(todo);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Edit task ${todo.title}`}
          sx={{
            p: { xs: 1, sm: 1.5 },
            mb: { xs: 0.75, sm: 1 },
            borderRadius: 2,
            cursor: 'pointer',
            bgcolor: 'background.paper',
            borderLeft: `3px solid ${accent.solid || priorityPalette.color}`,
            boxShadow: snapshot.isDragging ? 6 : isUrgent ? `0 0 0 1px ${accent.solid}55` : 1,
            transition: 'box-shadow 0.15s ease',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: { xs: '0.7rem', sm: '0.85rem' },
                fontWeight: 700,
                lineHeight: 1.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                textDecoration: isCompleted ? 'line-through' : 'none',
                color: isCompleted ? 'text.secondary' : 'text.primary',
              }}
            >
              {todo.title}
            </Typography>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                aria-label="Delete task"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(todo);
                }}
                sx={{ p: 0.25, flexShrink: 0 }}
              >
                <DeleteOutlineIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: { xs: 10, sm: 12 }, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }} color="text.secondary" noWrap>
                {formatDueDate(todo.dueDate)}
              </Typography>
            </Box>

            <Tooltip title={`${priorityMeta.label} priority`}>
              <Box
                aria-label={`${priorityMeta.label} priority`}
                sx={{
                  width: { xs: 7, sm: 8 },
                  height: { xs: 7, sm: 8 },
                  borderRadius: '50%',
                  bgcolor: priorityMeta.solid,
                  flexShrink: 0,
                }}
              />
            </Tooltip>
          </Box>

          {accent.dueMeta.label && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
              <WarningAmberIcon sx={{ fontSize: { xs: 10, sm: 12 }, color: accent.solid }} />
              <Typography sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' }, color: accent.solid, fontWeight: 600 }} noWrap>
                {accent.dueMeta.label}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Draggable>
  );
}
