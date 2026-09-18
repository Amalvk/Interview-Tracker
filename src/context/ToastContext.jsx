import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';

const ToastContext = createContext({
  showToast: () => {},
});

export function ToastProvider({ children }) {
  const theme = useTheme();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = useCallback((_, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);
  const severityColor = theme.palette[toast.severity]?.main || theme.palette.success.main;

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="standard"
          sx={{
            minWidth: 260,
            bgcolor: alpha(severityColor, theme.palette.mode === 'dark' ? 0.16 : 0.1),
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : severityColor,
            border: `1px solid ${alpha(severityColor, 0.25)}`,
            boxShadow: 'none',
            '& .MuiAlert-icon': { color: severityColor },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
