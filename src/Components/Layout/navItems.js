import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: SpaceDashboardOutlinedIcon, path: '/' },
  { key: 'active', label: 'Active Interviews', icon: WorkOutlineIcon, path: '/active' },
  { key: 'cracked', label: 'Cracked', icon: EmojiEventsOutlinedIcon, path: '/cracked' },
  { key: 'uncracked', label: 'Uncracked', icon: HighlightOffIcon, path: '/uncracked' },
  { key: 'topics', label: 'Topics', icon: MenuBookOutlinedIcon, path: '/topics' },
  { key: 'settings', label: 'Settings', icon: SettingsOutlinedIcon, path: '/settings' },
];
