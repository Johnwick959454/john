import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Invalid credentials');
      }

      const data = await res.json();
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'CLIENT') {
        navigate('/portal');
      } else if (data.user.role === 'GUARD') {
        navigate('/guard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-emerald-900 text-gold-500 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-emerald-900">Sign In to Covenant Shield</h2>
          <p className="text-xs text-gray-500 mt-1">
            Access Operations Dashboard, Client Portal, or Guard App
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@covenantshield.com"
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-md shadow transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
