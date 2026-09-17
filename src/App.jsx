import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './context/ThemeModeContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './Components/Layout/AppShell';

function App() {
  return (
    <BrowserRouter>
      <ThemeModeProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </ThemeModeProvider>
    </BrowserRouter>
  );
}

export default App;
