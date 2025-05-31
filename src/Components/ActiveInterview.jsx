import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchInterviewsFromFirestore, saveFormToFirestore, updateInterviewForm, updateInterviewStatus } from '../Redux/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import InterviewList from './InterviewList';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import CommonSkeleton from './Skelton';

function ActiveInterview() {
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    companyName: '',
    initialStatus: 1,
    position: '',
    contactNumber: '',
    contactName: '',
    applicationDate: format(new Date(), 'MMMM dd, yyyy') || dayjs(new Date()),
    skills: '',
    comments: ''
  });




  const { formState, formStatus } = useSelector(state => ({
    formState: state.form.interviewList.filter(item => item.initialStatus != 6),
    formStatus: state.form.fetchStatus
  }));



  const handleUpdate = (data) => {
    setUpdate(true);

    setFormData((prev) => {

      const updatedForm = {};
      for (const key in prev) {

        updatedForm[key] = data[key] !== undefined ? data[key] : prev[key];
      }
      if (data.id) {
        updatedForm.id = data.id;
      }
      return updatedForm;
    });
    handleOpen();
  };


  useEffect(() => {
    // Fetch all interviews on mount
    dispatch(fetchInterviewsFromFirestore());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const clearForm = () => {
    setFormData({
      companyName: '',
      initialStatus: '',
      position: '',
      applicationDate: format(new Date(), 'MMMM dd, yyyy'),
      skills: ''
    });
  }


  const handleSubmit = async () => {
    try {
      let resultAction;

      if (update) {
        // Update scenario — dispatch updateInterviewForm with id and formData
        const { id, ...updatedData } = formData;

        resultAction = await dispatch(updateInterviewForm({ id, updatedData }));
      } else {
        // Add new form scenario
        resultAction = await dispatch(saveFormToFirestore(formData));
      }

      // Check for success in either case
      if (
        saveFormToFirestore.fulfilled.match(resultAction) ||
        updateInterviewForm.fulfilled.match(resultAction)
      ) {
        dispatch(fetchInterviewsFromFirestore());
        handleClose();
        clearForm();
        setUpdate(false)
      } else {
        console.error("Save failed", resultAction.payload);
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };


  return (
    <>
      <Box onClick={() => { handleOpen(); clearForm() }} sx={{ textAlign: 'center', background: '#fff', p: 3, borderRadius: 2, boxShadow: 2 }}>
        <AddCircleOutlineIcon fontSize='large' color='#866e6e' />
        <Typography>Start by adding your interview to track.</Typography>
        <Button sx={{ textTransform: 'capitalize', background: 'gray' }} variant="contained">Add Interview</Button>
      </Box>
      {formState.map((interview) => {

        return <InterviewList key={interview.id} {...interview} handleUpdate={handleUpdate} />;
      })}
      <Box>{formStatus === 'loading' && <CommonSkeleton />}</Box>
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              minWidth: { xs: '90%', sm: '70%', md: '40%' },
              py: 2,
            }
          }}
        >
          <DialogTitle id="alert-dialog-title" display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            {"Add New Interview"}
            <CloseIcon onClick={handleClose} />
          </DialogTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', m: 2, gap: 2 }}>

            <Box>
              <Typography fontWeight={600} fontSize={15}>Company Name</Typography>
              <TextField
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                size='small'
                variant="outlined"
                placeholder="eg: Google"
                autoFocus
                fullWidth
              />
            </Box>
            <Box>
              <Typography fontWeight={600} fontSize={15}>Initial Status</Typography>
              { /* <TextField
                  name="initialStatus"
                  value={formData.initialStatus}
                  onChange={handleChange}
                  size='small'
                  variant="outlined"
                /> */}

              <Select
                width='100%'
                value={formData.initialStatus}
                name="initialStatus"
                onChange={handleChange}
                size='small'
                fullWidth
              >
                <MenuItem value={1}>Applied</MenuItem>
                <MenuItem value={2}>HR round</MenuItem>
                <MenuItem value={3}>Technical round</MenuItem>
                <MenuItem value={4}>management round</MenuItem>
                <MenuItem value={5}>Offer Received</MenuItem>
              </Select>


            </Box>

            <Box>
              <Typography fontWeight={600} fontSize={15}>Position</Typography>
              <TextField
                name="position"
                value={formData.position}
                onChange={handleChange}
                size="small"
                variant="outlined"
                placeholder="eg: Frontend Engineer"
                fullWidth
              />


            </Box>
            <Box>
              <Typography fontWeight={600} fontSize={15}>Contact number</Typography>

              <TextField
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                size="small"
                variant="outlined"
                placeholder="Contact number"
                fullWidth
              />
            </Box>

            <Box>
              <Typography fontWeight={600} fontSize={15}>HR Name</Typography>

              <TextField
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                size="small"
                variant="outlined"
                placeholder="Contact name"
                fullWidth
              />
            </Box>

            <Box>
              <Typography fontWeight={600} fontSize={15}>Skill set</Typography>
              <TextField
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                size='small'
                variant="outlined"
                placeholder="eg: React, Nodejs, Express"
                fullWidth
              />
            </Box>

            <Box>
              <Typography fontWeight={600} fontSize={15}>Comments</Typography>
              <TextField
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                size='small'
                variant="outlined"
                placeholder=" "
                fullWidth
                multiline
                rows={2}
              />
            </Box>
          </Box>

          <Box textAlign={'center'}>
            <Button size='small'
              sx={{
                color: '#fff',
                background: '#2a8b8c',
                fontSize: '0.7rem',
                textTransform: 'capitalize'
              }}
              onClick={handleSubmit} variant="contained">{update ? "Update" : "Submit"} form</Button>
          </Box>
        </Dialog>
      </Box>
    </>
  )
}

export default ActiveInterview