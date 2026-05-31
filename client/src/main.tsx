import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from '@/i18n';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import TwoAuth from './auth/TwoAuth';
import Dashboard from './dashboard/Dashboard';
import UnAvailable from './errors/404';
import Metric from './metrics/metric';
import App from './App';
import ProfilePage from './profile/profile';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <I18nProvider>
        <Router>
          <Routes>
            <Route path="/"                  element={<App />} />
            <Route path="/auth/signin"       element={<SignIn />} />
            <Route path="/auth/signup"       element={<SignUp />} />
            <Route path="/auth/twoauth"      element={<TwoAuth />} />
            <Route path="/dashboard"         element={<Dashboard />} />
            <Route path="/profile"           element={<ProfilePage />} />
            <Route path="/metrics/:id/:period" element={<Metric />} />
            <Route path="*"                  element={<UnAvailable />} />
          </Routes>
        </Router>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
