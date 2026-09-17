import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmptyState from './Shared/EmptyState';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

function Topics() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography variant="h5">Topics</Typography>
        <Typography variant="body2" color="text.secondary">
          Prep notes and topics to revisit before your next round.
        </Typography>
      </Box>
      <EmptyState
        icon={<MenuBookOutlinedIcon sx={{ fontSize: 40 }} />}
        title="Coming soon"
        description="This space is reserved for interview prep topics and notes."
      />
    </Box>
  );
}

export default Topics;
