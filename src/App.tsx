import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';
import { useAppStore } from './lib/store';

function App() {
  const initStore = useAppStore(state => state.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
