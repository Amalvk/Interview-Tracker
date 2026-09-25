import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LabeledSelect from '../Shared/LabeledSelect';
import ConfirmWarningModal from '../ConfirmWarningModal';
import { saveFormToFirestore, updateInterviewForm } from '../../Redux/formSlice';
import { ALL_STATUS_ORDER, STATUS, STATUS_META } from '../../statusConfig';
import { validateInterviewForm, FIELD_LIMITS, PLATFORM_OPTIONS } from './validation';

const STATUS_OPTIONS = ALL_STATUS_ORDER.map((value) => ({
  value,
  label: STATUS_META[value].label,
}));

function emptyForm() {
  return {
    companyName: '',
    initialStatus: STATUS.HR_ROUND,
    location: '',
    platform: '',
    platformOther: '',
    contactNumber: '',
    contactName: '',
    contactEmail: '',
    applicationDate: format(new Date(), 'MMMM dd, yyyy'),
    commentList: [],
  };
}

function normalizeCommentList(data) {
  if (Array.isArray(data.commentList)) {
    return data.commentList.map((c) => ({
      id: c.id ?? Date.now() + Math.random(),
      text: c.text ?? '',
      createdAt: c.createdAt || new Date().toISOString(),
    }));
  }
  if (data.comments) {
    return [{ id: Date.now(), text: String(data.comments), createdAt: new Date().toISOString() }];
  }
  return [];
}

function buildInitialForm(interview) {
  if (!interview) return emptyForm();
  const base = emptyForm();
  const next = { ...base };
  for (const key of Object.keys(base)) {
    if (key === 'commentList') continue;
    if (interview[key] !== undefined) next[key] = interview[key];
  }
  // Older records stored the job title/location under "position" — fall back
  // to it so existing interviews still show something in the new field.
  if (!next.location && interview.position) next.location = interview.position;
  next.commentList = normalizeCommentList(interview);
  if (interview.id) next.id = interview.id;
  return next;
}

function formatCommentDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : format(d, 'MMM d, yyyy · h:mm a');
}

export default function InterviewFormModal({ open, mode, interview, onClose }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isEdit = mode === 'edit';

  // Same per-status tinted background as StatusBadge. In dark mode the tint
  // sits on a near-black surface, so near-white text (60% opacity) reads
  // better there than colored text; light mode's pastel tint is too pale
  // for white text, so it keeps the status color instead.
  const getStatusOptionColor = (value) => {
    const meta = STATUS_META[value];
    if (!meta) return null;
    const isDark = theme.palette.mode === 'dark';
    return { bg: meta[isDark ? 'dark' : 'light'].bg, color: isDark ? 'rgba(255,255,255,0.7)' : meta.light.color };
  };

  const [formData, setFormData] = useState(emptyForm);
  const [initialSnapshot, setInitialSnapshot] = useState(emptyForm);
  const [draftComment, setDraftComment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const next = isEdit ? buildInitialForm(interview) : emptyForm();
    setFormData(next);
    setInitialSnapshot(next);
    setDraftComment('');
    setErrors({});
    setSubmitting(false);
  }, [open, isEdit, interview]);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialSnapshot),
    [formData, initialSnapshot],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePlatformChange = (value) => {
    setFormData((prev) => ({ ...prev, platform: value, platformOther: value === 'others' ? prev.platformOther : '' }));
    if (errors.platform) setErrors((prev) => ({ ...prev, platform: undefined }));
    if (value !== 'others' && errors.platformOther) setErrors((prev) => ({ ...prev, platformOther: undefined }));
  };

  const addCommentEntry = () => {
    const text = draftComment.trim();
    if (!text) return;
    setFormData((prev) => ({
      ...prev,
      commentList: [...(prev.commentList || []), { id: Date.now(), text, createdAt: new Date().toISOString() }],
    }));
    setDraftComment('');
  };

  const updateCommentText = (commentId, text) => {
    setFormData((prev) => ({
      ...prev,
      commentList: (prev.commentList || []).map((c) => (c.id === commentId ? { ...c, text } : c)),
    }));
  };

  const removeComment = (commentId) => {
    setFormData((prev) => ({
      ...prev,
      commentList: (prev.commentList || []).filter((c) => c.id !== commentId),
    }));
  };

  const requestClose = () => {
    if (isDirty && !submitting) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose();
  };

  const handleSubmit = async () => {
    const validationErrors = validateInterviewForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      let resultAction;
      if (isEdit) {
        const { id, ...updatedData } = formData;
        if (interview && formData.initialStatus !== interview.initialStatus) {
          updatedData.previousStatus = interview.initialStatus;
        }
        resultAction = await dispatch(updateInterviewForm({ id, updatedData }));
      } else {
        resultAction = await dispatch(
          saveFormToFirestore({ ...formData, commentList: formData.commentList || [] }),
        );
      }

      if (
        saveFormToFirestore.fulfilled.match(resultAction) ||
        updateInterviewForm.fulfilled.match(resultAction)
      ) {
        onClose();
      }
    } catch {
      // saving failed; leave the form open so the user can retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={requestClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="interview-form-title"
      >
        <DialogTitle
          id="interview-form-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2 }}
        >
          {isEdit ? 'Edit Interview' : 'Add New Interview'}
          <IconButton aria-label="Close dialog" onClick={requestClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, pt: 0.5 }}>
            <TextField
              name="companyName"
              label="Company Name"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google"
              autoFocus
              fullWidth
              error={!!errors.companyName}
              helperText={errors.companyName || `${formData.companyName.length}/${FIELD_LIMITS.companyName}`}
              inputProps={{ maxLength: FIELD_LIMITS.companyName }}
            />

            <LabeledSelect
              label="Status"
              value={formData.initialStatus}
              onChange={(value) => handleChange({ target: { name: 'initialStatus', value } })}
              options={STATUS_OPTIONS}
              getOptionColor={getStatusOptionColor}
              sx={{ width: '100%' }}
            />

            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru, India"
              fullWidth
              error={!!errors.location}
              helperText={errors.location || `${formData.location.length}/${FIELD_LIMITS.location}`}
              inputProps={{ maxLength: FIELD_LIMITS.location }}
            />

            <LabeledSelect
              label="Platform"
              value={formData.platform}
              onChange={handlePlatformChange}
              options={[{ value: '', label: 'Not specified' }, ...PLATFORM_OPTIONS]}
              sx={{ width: '100%' }}
            />

            {formData.platform === 'others' && (
              <TextField
                name="platformOther"
                label="Specify Platform"
                required
                value={formData.platformOther}
                onChange={handleChange}
                placeholder="e.g. Referral, Campus drive, WhatsApp group"
                fullWidth
                error={!!errors.platformOther}
                helperText={
                  errors.platformOther || `${formData.platformOther.length}/${FIELD_LIMITS.platformOther}`
                }
                inputProps={{ maxLength: FIELD_LIMITS.platformOther }}
              />
            )}

            <TextField
              name="contactNumber"
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. +1 555 123 4567"
              fullWidth
              error={!!errors.contactNumber}
              helperText={errors.contactNumber}
              inputProps={{ maxLength: FIELD_LIMITS.contactNumber }}
            />

            <TextField
              name="contactName"
              label="HR Name"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="e.g. Jane Doe"
              fullWidth
              error={!!errors.contactName}
              helperText={errors.contactName}
              inputProps={{ maxLength: FIELD_LIMITS.contactName }}
            />

            <TextField
              name="contactEmail"
              label="HR Email"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="e.g. jane.doe@company.com"
              fullWidth
              error={!!errors.contactEmail}
              helperText={errors.contactEmail}
              inputProps={{ maxLength: FIELD_LIMITS.contactEmail }}
            />

            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
                Comments
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a note…"
                  fullWidth
                  multiline
                  minRows={1}
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  inputProps={{ maxLength: FIELD_LIMITS.note }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addCommentEntry();
                    }
                  }}
                />
                <Button variant="outlined" size="small" onClick={addCommentEntry} sx={{ flexShrink: 0 }}>
                  Add
                </Button>
              </Box>
              <List
                dense
                disablePadding
                sx={{
                  maxHeight: 220,
                  overflow: 'auto',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1.5,
                  p: 0.5,
                }}
              >
                {[...(formData.commentList || [])]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((c) => (
                    <ListItem key={c.id} disableGutters sx={{ display: 'block', py: 1, px: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            {formatCommentDate(c.createdAt)}
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={1}
                            value={c.text}
                            onChange={(e) => updateCommentText(c.id, e.target.value)}
                            inputProps={{ maxLength: FIELD_LIMITS.note }}
                          />
                        </Box>
                        <IconButton size="small" aria-label="Delete comment" onClick={() => removeComment(c.id)} sx={{ mt: 2 }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                {!(formData.commentList || []).length && (
                  <ListItem>
                    <Typography variant="body2" color="text.secondary">
                      No notes yet. Add one above.
                    </Typography>
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button onClick={requestClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Saving…' : 'Save Interview'}
          </Button>
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
