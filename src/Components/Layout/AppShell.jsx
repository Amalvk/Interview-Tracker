import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Header from '../Header';
import Dashboard from '../Dashboard/Dashboard';
import ActiveInterview from '../ActiveInterview';
import UncrackedInterview from '../UncrackedInterview';
import Topics from '../Topics';
import SettingsPage from '../Settings/SettingsPage';
import { fetchInterviewsFromFirestore } from '../../Redux/formSlice';
import { STATUS } from '../../statusConfig';

const PAGES = {
  dashboard: Dashboard,
  active: ActiveInterview,
  uncracked: UncrackedInterview,
  topics: Topics,
  settings: SettingsPage,
};

export default function AppShell() {
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInterviewsFromFirestore());
  }, [dispatch]);

  const interviewList = useSelector((state) => state.form.interviewList);
  const counts = useMemo(() => {
    const active = interviewList.filter((i) => i.initialStatus !== STATUS.UNCRACKED).length;
    const uncracked = interviewList.filter((i) => i.initialStatus === STATUS.UNCRACKED).length;
    return { active, uncracked };
  }, [interviewList]);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar activePage={activePage} onNavigate={handleNavigate} counts={counts} />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          counts={counts}
          onNavItemClick={() => setMobileOpen(false)}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        }}
      >
        <Header activePage={activePage} onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3.5 } }}>
          <PageComponent onNavigate={handleNavigate} />
        </Box>
      </Box>
    </Box>
  );
}
