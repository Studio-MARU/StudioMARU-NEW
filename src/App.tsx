import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalNav from '@/components/GlobalNav';
import SiteGate from '@/components/SiteGate';
import AboutUs from '@/pages/AboutUs';
import Dashboard from '@/pages/dashboard/Dashboard';
import Impressum from '@/pages/Impressum';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Portfolio from '@/pages/Portfolio';

export default function App() {
  return (
    <SiteGate>
      <BrowserRouter>
        <GlobalNav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </BrowserRouter>
    </SiteGate>
  );
}
