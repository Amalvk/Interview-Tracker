import { ThemeModeProvider } from './context/ThemeModeContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './Components/Layout/AppShell';

function App() {
  return (
    <ThemeModeProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </ThemeModeProvider>
  );
}

export default App;
