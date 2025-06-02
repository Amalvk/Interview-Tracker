import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInterviewStatus } from '../Redux/formSlice';
import Snackbar from '@mui/material/Snackbar';
import CommonButton from './CommonButton';

function InterviewList(props) {
    const { id, companyName, position, applicationDate, skills, initialStatus, contactNumber, comments, contactName, handleUpdate } = props;

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus) => {
        dispatch(updateInterviewStatus({ id, newStatus }));
        setOpen(true);
    };

    const handleCall = (mobile) => {
        window.location.href = `tel:${mobile}`;
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
                    {comments && <Box mt={4}>Comments : {comments}</Box>}
                    <Box pt={1} fontSize={10} fontWeight={600} color={'#a3acad'}>Date : {applicationDate}</Box>

                </Box>
                <Box>
                    <Select
                        value={initialStatus}               // value must be a number (1,2,3,...)
                        onChange={(e) => { handleStatusChange(e.target.value) }}      // handle user selection
                        size="small"
                        fullWidth
                        sx={{ fontSize: '0.7rem', height: 25 }}
                    >
                        <MenuItem sx={{ fontSize: '10px' }} value={1}>Applied</MenuItem>
                        <MenuItem sx={{ fontSize: '10px' }} value={2}>HR Round</MenuItem>
                        <MenuItem sx={{ fontSize: '10px' }} value={3}>Technical Round</MenuItem>
                        <MenuItem sx={{ fontSize: '10px' }} value={4}>Management Round</MenuItem>
                        <MenuItem sx={{ fontSize: '10px' }} value={5}>Offer Received</MenuItem>
                    </Select>

                    {/* <Typography> {interviewStatus(initialStatus)}</Typography> */}
                    <Box textAlign={'right'} >
                        <CommonButton
                            label="Update"
                            variant="contained"
                            color="#fff"
                            bg="#2a8b8c"
                            handleClick={() => handleUpdate(props)}  // direct call if no value needed
                        />
                    </Box>

                    <Box textAlign={'right'} >
                        <CommonButton
                            label="Call"
                            variant="contained"
                            color="#fff"
                            bg="#22348c"
                            handleClick={handleCall}
                            value={contactNumber}
                        />
                    </Box>

                    <Box textAlign={'right'} >
                        <CommonButton
                            label="Decline"
                            variant="outlined"
                            color="red"
                            borderColor="#e29e55"
                            handleClick={handleStatusChange}
                            value={6}
                        />
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