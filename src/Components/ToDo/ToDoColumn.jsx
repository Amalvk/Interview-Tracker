import { Droppable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ToDoCardItem from './ToDoCardItem';

export default function ToDoColumn({ status, title, accentColor, todos, onEdit, onDelete }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)'),
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.5,
          px: { xs: 0.75, sm: 1.5 },
          py: { xs: 0.75, sm: 1 },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          borderTop: `3px solid ${accentColor}`,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Typography
          sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, fontWeight: 700 }}
          noWrap
        >
          {title}
        </Typography>
        <Chip
          label={todos.length}
          size="small"
          sx={{
            height: { xs: 16, sm: 20 },
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            '& .MuiChip-label': { px: { xs: 0.6, sm: 1 } },
          }}
        />
      </Box>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              minHeight: 80,
              p: { xs: 0.5, sm: 1 },
              bgcolor: snapshot.isDraggingOver
                ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(74,222,128,0.06)' : 'rgba(22,163,74,0.05)')
                : 'transparent',
              transition: 'background-color 0.15s ease',
            }}
          >
            {todos.map((todo, index) => (
              <ToDoCardItem key={todo.id} todo={todo} index={index} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {provided.placeholder}
            {todos.length === 0 && (
              <Typography
                sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' }, py: 2 }}
                color="text.secondary"
                align="center"
                display="block"
              >
                Nothing here
              </Typography>
            )}
          </Box>
        )}
      </Droppable>
    </Box>
  );
}
