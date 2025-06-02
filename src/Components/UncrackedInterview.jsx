import { Box, Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteInterviewById, fetchInterviewsFromFirestore, updateInterviewStatus } from '../Redux/formSlice';
import CommonButton from './CommonButton';

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
            {item.comments && <Box mt={4}>Comments : {item.comments}</Box>}
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