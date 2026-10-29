import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-emerald-900 text-white shadow-md border-b border-gold-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-12" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
          <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-gold-500 transition-colors">About</Link>
          <Link to="/services" className="hover:text-gold-500 transition-colors">Services</Link>
          <Link to="/request-service" className="hover:text-gold-500 transition-colors">Request Service</Link>
          <Link to="/feedback" className="hover:text-gold-500 transition-colors">Feedback & Complaints</Link>
          <Link to="/track" className="hover:text-gold-500 transition-colors">Track Request/Case</Link>
        </nav>

        <div className="flex items-center gap-4">
          {token && user ? (
            <div className="flex items-center gap-3">
              <Link
                to={
                  user.role === 'CLIENT'
                    ? '/portal'
                    : user.role === 'GUARD'
                    ? '/guard'
                    : '/dashboard'
                }
                className="bg-gold-500 hover:bg-gold-600 text-emerald-950 px-4 py-2 rounded-md font-semibold text-sm shadow transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gold-500 hover:bg-gold-600 text-emerald-950 px-5 py-2.5 rounded-md font-bold text-sm shadow transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
