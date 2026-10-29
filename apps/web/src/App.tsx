import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './routes/Home';
import { About } from './routes/About';
import { ServicesPage } from './routes/ServicesPage';
import { RequestService } from './routes/RequestService';
import { Feedback } from './routes/Feedback';
import { Track } from './routes/Track';
import { Login } from './routes/Login';
import { OperationsDashboard } from './routes/OperationsDashboard';
import { GuardPWA } from './routes/GuardPWA';
import { ClientPortal } from './routes/ClientPortal';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface-light text-surface-text">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/request-service" element={<RequestService />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/track" element={<Track />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<OperationsDashboard />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/guard" element={<GuardPWA />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
