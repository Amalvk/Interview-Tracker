import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInterviewStatus } from '../Redux/formSlice';
import Snackbar from '@mui/material/Snackbar';

function InterviewList(props) {
    const { id, companyName, position, applicationDate, skills, initialStatus, contactNumber, comments, contactName,handleUpdate } = props;

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus) => {
        dispatch(updateInterviewStatus({ id, newStatus }));
        setOpen(true);
    };

    return (
        <Box
            key={id}
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
                    p: "20px 10px 20px 20px",
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
                    <Box fontSize={15} fontWeight={600}>{companyName}</Box>
                    <Box color={'#ba9e9e'} fontWeight={600}> {position}</Box>
                    <Box pt={.5}>Contact : {contactNumber}</Box>
                    {contactName && <Box display={'flex'}>HR Name :  {contactName}</Box>}
                    <Box>Skills : {skills}</Box>
                    <Box>Date : {applicationDate}</Box>
                    {comments && <Box mt={4}>Comments : {comments}</Box>}
                </Box>
                <Box>
                    <Select
                        value={initialStatus}               // value must be a number (1,2,3,...)
                        onChange={(e) => { handleStatusChange(e.target.value) }}      // handle user selection
                        size="small"
                        fullWidth
                        sx={{ fontSize: '0.7rem', height: 25 }}
                    >
                        <MenuItem value={1}>Applied</MenuItem>
                        <MenuItem value={2}>HR Round</MenuItem>
                        <MenuItem value={3}>Technical Round</MenuItem>
                        <MenuItem value={4}>Management Round</MenuItem>
                        <MenuItem value={5}>Offer Received</MenuItem>
                    </Select>

                    {/* <Typography> {interviewStatus(initialStatus)}</Typography> */}
                    <Box textAlign={'right'} >
                        <Button size='small'
                            variant="contained"
                            sx={{
                                mt: 2,
                                pr: 1,
                                gap: 1,
                                textTransform: 'capitalize',
                                color: '#fff',
                                background: '#5592e2',
                                height: 20,
                                fontSize: '0.7rem',
                            }}
                            onClick={() => handleUpdate(props)}>
                            Update
                        </Button>
                    </Box>

                    <Box textAlign={'right'} >
                        <Button size='small'
                            variant="outlined"
                            sx={{
                                mt: 2,
                                pr: 1,
                                fontWeight:600,
                                textTransform: 'capitalize',
                                borderColor: 'red',
                                color: '#e29e55 ',
                                height: 20,
                                fontSize: '0.7rem',
                            }}
                            onClick={() => handleStatusChange(6)}>
                            Decline
                        </Button>
                    </Box>


                </Box>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message={`${companyName}'s interview status changed !!`}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    )
}

export default InterviewList