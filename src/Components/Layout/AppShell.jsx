import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Header from '../Header';
import Dashboard from '../Dashboard/Dashboard';
import ActiveInterview from '../ActiveInterview';
import CrackedInterview from '../CrackedInterview';
import UncrackedInterview from '../UncrackedInterview';
import Topics from '../Topics';
import SettingsPage from '../Settings/SettingsPage';
import { fetchInterviewsFromFirestore } from '../../Redux/formSlice';
import { isActiveStage, isCrackedStatus, isUncrackedStatus } from '../../statusConfig';

export default function AppShell() {
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(fetchInterviewsFromFirestore());
  }, [dispatch]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    setMobileOpen(false);
  }, [pathname]);

  const interviewList = useSelector((state) => state.form.interviewList);
  const counts = useMemo(() => {
    const active = interviewList.filter((i) => isActiveStage(i.initialStatus)).length;
    const cracked = interviewList.filter((i) => isCrackedStatus(i.initialStatus)).length;
    const uncracked = interviewList.filter((i) => isUncrackedStatus(i.initialStatus)).length;
    return { active, cracked, uncracked };
  }, [interviewList]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' }, height: '100%', flexShrink: 0 }}>
        <Sidebar counts={counts} />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Sidebar counts={counts} onNavItemClick={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        ref={contentRef}
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3.5 } }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/active" element={<ActiveInterview />} />
            <Route path="/cracked" element={<CrackedInterview />} />
            <Route path="/uncracked" element={<UncrackedInterview />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
