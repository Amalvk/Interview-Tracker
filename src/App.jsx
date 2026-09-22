import { BrowserRouter } from 'react-router-dom';
import { ThemeModeProvider } from './context/ThemeModeContext';
import AppShell from './Components/Layout/AppShell';

function App() {
  return (
    <BrowserRouter>
      <ThemeModeProvider>
        <AppShell />
      </ThemeModeProvider>
    </BrowserRouter>
  );
}

export default App;
