import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { NAV_ITEMS } from './navItems';

export const SIDEBAR_WIDTH = 248;

export default function Sidebar({ activePage, onNavigate, counts = {}, onNavItemClick }) {
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 2.75 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WorkspacePremiumIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontSize: '1.05rem', lineHeight: 1.2 }}>
          Interview Tracker
        </Typography>
      </Box>

      <List sx={{ px: 1.5, flexGrow: 1 }} component="nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = activePage === item.key;
          const count = counts[item.key];
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => {
                onNavigate(item.key);
                onNavItemClick?.();
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.16)' : 'rgba(79,70,229,0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&.Mui-selected:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.22)' : 'rgba(79,70,229,0.12)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: selected ? 600 : 500 }}
              />
              {typeof count === 'number' && count > 0 && (
                <Chip label={count} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
