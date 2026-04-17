/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Login from './pages/Login';

type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'theme';

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

// Simple auth check for prototype
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  useEffect(() => {
    const theme = getInitialTheme();
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="projects" element={<Projects />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </Router>
  );
}
