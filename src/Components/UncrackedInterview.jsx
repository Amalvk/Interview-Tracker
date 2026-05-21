import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteInterviewById, fetchInterviewsFromFirestore, updateInterviewStatus } from '../Redux/formSlice';
import CommonButton from './CommonButton';
import ConfirmWarningModal from './ConfirmWarningModal';
import { actionsColumnSx } from './cardLayout';

function getNotesForDisplay({ commentList, comments }) {
  if (Array.isArray(commentList) && commentList.length) {
    return [...commentList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (comments) {
    return [{ id: 'legacy', text: String(comments), createdAt: null }];
  }
  return [];
}

function formatNoteDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : format(d, 'MMM d, yyyy');
}

function UncrackedInterview() {

  const formState = useSelector(state => state.form.interviewList.filter(item => item.initialStatus == 6));
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const pendingItem = formState.find((item) => item.id === pendingDeleteId);

  const handleDelete = (nodeId) => {
    dispatch(deleteInterviewById({ nodeId }));
    dispatch(fetchInterviewsFromFirestore())
  };

  const handleDeleteClick = (nodeId) => {
    setPendingDeleteId(nodeId);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      handleDelete(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInterviewStatus({ id, newStatus }));
  };



  return (
    <>{formState.map((item) => {
      const notes = getNotesForDisplay(item);

      return (<Box
        key={item.id}
        sx={{
          width: '100%',
          maxWidth: '100%',
          borderRadius: 2,
          boxShadow: 2,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 6,
            cursor: 'pointer',
          },
        }}
      >
        <Box
          sx={{
            background: '#fff',
            mt: 3,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 8,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
              width: '100%',
            }}
          >
          <Box sx={{ flex: 1, minWidth: 0, fontSize: 13 }}>
            <Box fontSize={15} fontWeight={600}> {item.companyName}</Box>
            <Box color={'#ba9e9e'}> {item.position}</Box>
            <Box pt={.5}>Number : {item.contactNumber}</Box>
            <Box pt={.5}>Name : {item.contactName}</Box>
            <Box>Skills : {item.skills}</Box>
          </Box>
          <Box sx={actionsColumnSx}>
            <Box textAlign={'right'} sx={{ width: '100%' }}>
              <CommonButton
                label="Activate"
                variant="contained"
                color="#fff"
                bg="#2a8b8c"
                handleClick={(id) => handleStatusChange(id, 1)}
                value={item.id}
                sx={{ width: '100%' }}
              />
            </Box>

            <Box textAlign={'right'} sx={{ width: '100%' }}>
              <CommonButton
                label="Delete"
                variant="outlined"
                color="#d87849"
                borderColor="#e29e55"
                handleClick={handleDeleteClick}
                value={item.id}
                icon={<DeleteIcon sx={{ fontSize: 15 }} />}
                sx={{ width: '100%', pr: 0 }}
              />
            </Box>
          </Box>
          </Box>

          {notes.length > 0 && (
            <Box sx={{ width: '100%', alignSelf: 'stretch', boxSizing: 'border-box' }}>
              <Typography fontWeight={600} fontSize={12} color="text.secondary">Notes</Typography>
              {notes.map((n) => (
                <Box
                  key={n.id}
                  sx={{
                    mt: 0.5,
                    pl: 1,
                    width: '100%',
                    maxWidth: '100%',
                    borderLeft: '2px solid #e0e0e0',
                    boxSizing: 'border-box',
                  }}
                >
                  {n.createdAt && (
                    <Typography
                      component="div"
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: 12, mb: 0.25, display: 'block' }}
                    >
                      {formatNoteDate(n.createdAt)}
                    </Typography>
                  )}
                  <Typography
                    component="div"
                    sx={{
                      fontSize: 12,
                      display: 'block',
                      width: '100%',
                      maxWidth: '100%',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {n.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ fontSize: 10, fontWeight: 600, color: '#a3acad', width: '100%' }}>
            Date : {item.applicationDate}
          </Box>
        </Box>
      </Box>)
    })}

      <ConfirmWarningModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Delete interview?"
        message={
          pendingItem
            ? `Permanently delete "${pendingItem.companyName}"? This cannot be undone.`
            : 'Permanently delete this interview? This cannot be undone.'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>)
}

export default UncrackedInterview