import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteInterviewById, fetchInterviewsFromFirestore, updateInterviewStatus } from '../Redux/formSlice';
import CommonButton from './CommonButton';

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

  const handleDelete = (nodeId) => {
    dispatch(deleteInterviewById({ nodeId }));
    dispatch(fetchInterviewsFromFirestore())
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInterviewStatus({ id, newStatus }));
  };



  return (
    <>{formState.map((item) => {
      const notes = getNotesForDisplay(item);

      return (<Box
        // key={id}
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 6, // stronger shadow on hover
            cursor: 'pointer', // optional, shows pointer on hover
          },
        }}
      >
        <Box
          sx={{
            background: '#fff',
            mt: 3,
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 8,
            },
          }}
        >
          <Box fontSize={13}>
            <Box fontSize={15} fontWeight={600}> {item.companyName}</Box>
            <Box color={'#ba9e9e'}> {item.position}</Box>
            <Box pt={.5}>Number : {item.contactNumber}</Box>
            <Box pt={.5}>Name : {item.contactName}</Box>
            <Box>Skills : {item.skills}</Box>
            {notes.length > 0 && (
              <Box mt={2}>
                <Typography fontWeight={600} fontSize={12} color="text.secondary">Notes</Typography>
                {notes.map((n) => (
                  <Box key={n.id} fontSize={12} sx={{ mt: 0.5, pl: 0.5, borderLeft: '2px solid #e0e0e0' }}>
                    {n.createdAt && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {formatNoteDate(n.createdAt)}
                      </Typography>
                    )}
                    {n.text}
                  </Box>
                ))}
              </Box>
            )}
            <Box pt={1} fontSize={10} fontWeight={600} color={'#a3acad'}>Date : {item.applicationDate}</Box>

          </Box>
          <Box>

            <Box textAlign={'right'} >
              <CommonButton
                label="Activate"
                variant="contained"
                color="#fff"
                bg="#2a8b8c"
                handleClick={(id) => handleStatusChange(id, 1)}
                value={item.id}
              />
            </Box>

            <Box textAlign={'right'}>
              <CommonButton
                label="Delete"
                variant="outlined"
                color="#d87849"
                borderColor="#e29e55"
                handleClick={handleDelete}
                value={item.id}
                icon={<DeleteIcon sx={{ fontSize: 15 }} />}
                sx={{ pr: 0 }}
              />
            </Box>

          </Box>
        </Box>
      </Box>)
    })}
    </>)
}

export default UncrackedInterview