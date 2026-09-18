import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LabeledSelect from '../Shared/LabeledSelect';
import ConfirmWarningModal from '../ConfirmWarningModal';
import { saveTodoToFirestore, updateTodoInFirestore } from '../../Redux/todoSlice';
import {
  TODO_PRIORITY,
  TODO_PRIORITY_ORDER,
  TODO_STATUS,
  getTodoPriorityMeta,
  getTodoStatusMeta,
} from '../../todoConfig';
import { validateTodoForm, FIELD_LIMITS } from './validation';
import { useToast } from '../../context/ToastContext';

// In Progress is temporarily off the board (see ToDoPage's BOARD_COLUMNS) —
// keep the picker limited to what actually has somewhere to go.
const STATUS_OPTIONS = [TODO_STATUS.PENDING, TODO_STATUS.COMPLETED].map((value) => ({
  value,
  label: getTodoStatusMeta(value).label,
}));

const PRIORITY_OPTIONS = TODO_PRIORITY_ORDER.map((value) => ({
  value,
  label: getTodoPriorityMeta(value).label,
}));

function emptyForm() {
  return {
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: TODO_STATUS.PENDING,
    priority: TODO_PRIORITY.MEDIUM,
  };
}

function buildInitialForm(todo) {
  if (!todo) return emptyForm();
  const base = emptyForm();
  const next = { ...base };
  for (const key of Object.keys(base)) {
    if (todo[key] !== undefined) next[key] = todo[key];
  }
  if (todo.id) next.id = todo.id;
  return next;
}

export default function ToDoFormModal({ open, mode, todo, onClose, onDeleteRequest }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const theme = useTheme();
  const isEdit = mode === 'edit';

  const getStatusOptionColor = (value) => {
    const meta = getTodoStatusMeta(value);
    if (!meta) return null;
    const isDark = theme.palette.mode === 'dark';
    return { bg: meta[isDark ? 'dark' : 'light'].bg, color: isDark ? 'rgba(255,255,255,0.7)' : meta.light.color };
  };

  const getPriorityOptionColor = (value) => {
    const meta = getTodoPriorityMeta(value);
    if (!meta) return null;
    const isDark = theme.palette.mode === 'dark';
    return { bg: meta[isDark ? 'dark' : 'light'].bg, color: isDark ? 'rgba(255,255,255,0.7)' : meta.light.color };
  };

  const [formData, setFormData] = useState(emptyForm);
  const [initialSnapshot, setInitialSnapshot] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next = isEdit ? buildInitialForm(todo) : emptyForm();
    setFormData(next);
    setInitialSnapshot(next);
    setErrors({});
    setSubmitting(false);
  }, [open, isEdit, todo]);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialSnapshot),
    [formData, initialSnapshot],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const requestClose = () => {
    if (isDirty && !submitting) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    const validationErrors = validateTodoForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      let resultAction;
      if (isEdit) {
        const { id, ...updatedData } = formData;
        resultAction = await dispatch(updateTodoInFirestore({ id, updatedData }));
      } else {
        resultAction = await dispatch(saveTodoToFirestore(formData));
      }

      if (
        saveTodoToFirestore.fulfilled.match(resultAction) ||
        updateTodoInFirestore.fulfilled.match(resultAction)
      ) {
        showToast(isEdit ? 'Task updated successfully.' : 'Task added successfully.', 'success');
        onClose();
      } else {
        showToast('Something went wrong while saving. Please try again.', 'error');
      }
    } catch {
      showToast('Something went wrong while saving. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} fullWidth maxWidth="sm" aria-labelledby="todo-form-title">
        <DialogTitle id="todo-form-title" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}>
          {isEdit ? 'Edit Task' : 'Add New Task'}
          <IconButton aria-label="Close dialog" onClick={requestClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 0.5 }}>
            <TextField
              name="title"
              label="Title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Revise system design basics"
              autoFocus
              fullWidth
              error={!!errors.title}
              helperText={errors.title || `${formData.title.length}/${FIELD_LIMITS.title}`}
              inputProps={{ maxLength: FIELD_LIMITS.title }}
            />

            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <LabeledSelect
                label="Status"
                value={formData.status}
                onChange={(value) => handleChange({ target: { name: 'status', value } })}
                options={STATUS_OPTIONS}
                getOptionColor={getStatusOptionColor}
                sx={{ flex: 1, minWidth: 160 }}
              />

              <LabeledSelect
                label="Priority"
                value={formData.priority}
                onChange={(value) => handleChange({ target: { name: 'priority', value } })}
                options={PRIORITY_OPTIONS}
                getOptionColor={getPriorityOptionColor}
                sx={{ flex: 1, minWidth: 160 }}
              />
            </Box>

            <TextField
              name="description"
              label="Notes"
              value={formData.description}
              onChange={handleChange}
              placeholder="Any details worth remembering…"
              fullWidth
              multiline
              minRows={3}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/${FIELD_LIMITS.description}`}
              inputProps={{ maxLength: FIELD_LIMITS.description }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, justifyContent: isEdit ? 'space-between' : 'flex-end' }}>
          {isEdit && (
            <IconButton
              aria-label="Delete task"
              color="error"
              disabled={submitting}
              onClick={() => {
                onClose();
                onDeleteRequest?.(todo);
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={requestClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {submitting ? 'Saving…' : 'Save Task'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <ConfirmWarningModal
        open={confirmDiscardOpen}
        onClose={() => setConfirmDiscardOpen(false)}
        onConfirm={onClose}
        title="Discard changes?"
        message="You have unsaved changes. Closing now will lose them."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
