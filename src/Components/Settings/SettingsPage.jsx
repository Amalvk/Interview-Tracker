import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import { useThemeMode } from '../../context/ThemeModeContext';

export default function SettingsPage() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 640 }}>
      <Box>
        <Typography variant="h5">Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Preferences for how Interview Tracker looks and behaves.
        </Typography>
      </Box>

      <Card sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Appearance
        </Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
          label="Dark mode"
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Your data is stored in Firestore and shared across devices signed in to this app.
          Theme preference is saved locally to this browser.
        </Typography>
      </Card>
    </Box>
  );
}
