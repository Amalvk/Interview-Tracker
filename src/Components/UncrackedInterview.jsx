import { Box, Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteInterviewById, fetchInterviewsFromFirestore, updateInterviewStatus } from '../Redux/formSlice';

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
      console.log(item.id);

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
          <Box>
            <Box fontWeight={600}>Company Name : {item.companyName}</Box>
            <Box>Position : {item.position}</Box>
            <Box>Date : {item.contactNumber}</Box>
            <Box>Skills : {item.skills}</Box>
          </Box>
          <Box>
            <Typography>Status :  Not Cracked</Typography>
            <Box textAlign={'right'} ><Button size='small' sx={{ mt: 2, pr: 1, gap: 1, textTransform: 'capitalize' }} onClick={() => handleStatusChange(item.id, 1)}> Activate </Button></Box>
            <Box textAlign={'right'} ><Button size='small' variant="contained" sx={{ mt: 2, pr: 0, gap: 1, textTransform: 'capitalize' }} onClick={() => handleDelete(item.id)}> Delete<DeleteIcon /> </Button></Box>

          </Box>
        </Box>
      </Box>)
    })}
    </>)
}

export default UncrackedInterview