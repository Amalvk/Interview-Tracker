import { Box, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';

function UncrackedInterview() {

  const formState = useSelector(state => state.form.interviewList.filter(item => item.initialStatus ==6));
  
  
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
          <Box>
            <Box fontWeight={600}>Company Name : {item.companyName}</Box>
            <Box>Position : {item.position}</Box>
            <Box>Date : {item.contactNumber}</Box>
            <Box>Skills : {item.skills}</Box>
          </Box>
          <Box>
            <Typography>Status :  Not Cracked</Typography>
          </Box>
        </Box>
      </Box>)
    })}
    </>)
}

export default UncrackedInterview