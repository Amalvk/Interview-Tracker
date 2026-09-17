import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: SpaceDashboardOutlinedIcon },
  { key: 'active', label: 'Active Interviews', icon: WorkOutlineIcon },
  { key: 'cracked', label: 'Cracked', icon: EmojiEventsOutlinedIcon },
  { key: 'uncracked', label: 'Uncracked', icon: HighlightOffIcon },
  { key: 'topics', label: 'Topics', icon: MenuBookOutlinedIcon },
  { key: 'settings', label: 'Settings', icon: SettingsOutlinedIcon },
];
