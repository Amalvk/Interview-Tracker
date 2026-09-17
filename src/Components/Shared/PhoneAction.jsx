import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Click the phone number itself to call or WhatsApp it — no separate icon
// buttons needed alongside the number.
export default function PhoneAction({ phone, variant = 'body2', sx }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
    setAnchorEl(null);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits) window.open(`https://wa.me/${digits}`, '_blank', 'noopener,noreferrer');
    setAnchorEl(null);
  };

  return (
    <>
      <Typography
        component="button"
        type="button"
        onClick={handleOpen}
        variant={variant}
        aria-haspopup="menu"
        sx={{
          font: 'inherit',
          color: 'primary.main',
          background: 'none',
          border: 'none',
          p: 0,
          cursor: 'pointer',
          textAlign: 'left',
          textDecoration: 'none',
          ...sx,
        }}
      >
        {phone}
      </Typography>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleCall}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
          Call
        </MenuItem>
        <MenuItem onClick={handleWhatsApp}>
          <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
          WhatsApp
        </MenuItem>
      </Menu>
    </>
  );
}
