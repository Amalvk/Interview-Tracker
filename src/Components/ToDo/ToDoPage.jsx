import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StatCard from '../Dashboard/StatCard';
import ToDoColumn from './ToDoColumn';
import ToDoFormModal from './ToDoFormModal';
import ConfirmWarningModal from '../ConfirmWarningModal';
import SearchBar from '../Shared/SearchBar';
import EmptyState from '../Shared/EmptyState';
import ErrorState from '../Shared/ErrorState';
import CommonSkeleton from '../Skelton';
import { useToast } from '../../context/ToastContext';
import { deleteTodoById, fetchTodosFromFirestore, updateTodoStatus } from '../../Redux/todoSlice';
import { TODO_STATUS, getTodoStatusMeta } from '../../todoConfig';
import { getDueMeta, groupTodosByStatus, matchesTodoSearch } from '../../utils/todoUtils';

const BOARD_COLUMNS = [
  { status: TODO_STATUS.PENDING, title: 'To Do' },
  { status: TODO_STATUS.IN_PROGRESS, title: 'In Progress' },
  { status: TODO_STATUS.COMPLETED, title: 'Done' },
];

export default function ToDoPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { todoList, fetchStatus } = useSelector((state) => ({
    todoList: state.todo.todoList,
    fetchStatus: state.todo.fetchStatus,
  }));

  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedTodo, setSelectedTodo] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchTodosFromFirestore());
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = todoList.length;
    const pending = todoList.filter((t) => t.status === TODO_STATUS.PENDING).length;
    const inProgress = todoList.filter((t) => t.status === TODO_STATUS.IN_PROGRESS).length;
    const completed = todoList.filter((t) => t.status === TODO_STATUS.COMPLETED).length;
    const needsAttention = todoList.filter((t) => ['overdue', 'due-today'].includes(getDueMeta(t).kind)).length;
    return { total, pending, inProgress, completed, needsAttention };
  }, [todoList]);

  const filtered = useMemo(() => todoList.filter((t) => matchesTodoSearch(t, search)), [todoList, search]);
  const columns = useMemo(() => groupTodosByStatus(filtered), [filtered]);

  const openAddModal = () => {
    setFormMode('add');
    setSelectedTodo(null);
    setFormOpen(true);
  };

  const openEditModal = (todo) => {
    setFormMode('edit');
    setSelectedTodo(todo);
    setFormOpen(true);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    const todo = todoList.find((t) => t.id === draggableId);
    if (!todo) return;

    const resultAction = await dispatch(updateTodoStatus({ id: todo.id, status: newStatus }));
    if (updateTodoStatus.fulfilled.match(resultAction)) {
      showToast(`Moved "${todo.title}" to ${getTodoStatusMeta(newStatus).label}.`, 'success');
    } else {
      showToast('Could not update the status. Please try again.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteTodoById(deleteTarget.id));
    if (deleteTodoById.fulfilled.match(result)) {
      showToast(`Deleted "${deleteTarget.title}".`, 'success');
    } else {
      showToast('Could not delete this task. Please try again.', 'error');
    }
    setDeleteTarget(null);
  };

  const hasAnyTodos = todoList.length > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h5">To-Do</Typography>
          <Typography variant="body2" color="text.secondary">
            Drag a task between columns to update its status. Sorted by due date and priority.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddModal} sx={{ height: 'fit-content' }}>
          Add Task
        </Button>
      </Box>

      {hasAnyTodos && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard label="Total Tasks" value={stats.total} icon={<ChecklistIcon />} accentColor="#16A34A" />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard label="Pending" value={stats.pending} icon={<PendingActionsOutlinedIcon />} accentColor="#D97706" />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard label="In Progress" value={stats.inProgress} icon={<AutorenewIcon />} accentColor="#1D4ED8" />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard label="Completed" value={stats.completed} icon={<CheckCircleOutlineIcon />} accentColor="#15803D" />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard label="Needs Attention" value={stats.needsAttention} icon={<WarningAmberIcon />} accentColor="#DC2626" />
          </Grid>
        </Grid>
      )}

      {hasAnyTodos && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search title or notes…" />
          <Typography variant="body2" color="text.secondary">
            {filtered.length} of {todoList.length} task{todoList.length === 1 ? '' : 's'}
          </Typography>
        </Stack>
      )}

      {fetchStatus === 'loading' && todoList.length === 0 && <CommonSkeleton />}

      {fetchStatus === 'failed' && todoList.length === 0 && (
        <ErrorState
          title="Couldn't load your tasks"
          description="Unable to load your to-do list. Please try again."
          onRetry={() => dispatch(fetchTodosFromFirestore())}
        />
      )}

      {fetchStatus !== 'loading' && fetchStatus !== 'failed' && !hasAnyTodos && (
        <EmptyState
          icon={<ChecklistIcon sx={{ fontSize: 40 }} />}
          title="No tasks yet"
          description="Add prep tasks and follow-ups with due dates — overdue ones will get flagged automatically."
          actionLabel="+ Add Task"
          onAction={openAddModal}
        />
      )}

      {hasAnyTodos && filtered.length === 0 && (
        <EmptyState title="No matching tasks" description="Try adjusting your search." />
      )}

      {hasAnyTodos && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1.5, md: 2 }, alignItems: 'stretch' }}>
            {BOARD_COLUMNS.map((column) => (
              <ToDoColumn
                key={column.status}
                status={column.status}
                title={column.title}
                accentColor={getTodoStatusMeta(column.status).solid}
                todos={columns[column.status] || []}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
              />
            ))}
          </Box>
        </DragDropContext>
      )}

      <ToDoFormModal open={formOpen} mode={formMode} todo={selectedTodo} onClose={() => setFormOpen(false)} />

      <ConfirmWarningModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete task?"
        message={
          deleteTarget ? `Are you sure you want to remove "${deleteTarget.title}"? This action cannot be undone.` : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </Box>
  );
}
