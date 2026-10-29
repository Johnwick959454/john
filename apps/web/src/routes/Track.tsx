import React, { useState } from 'react';

export const Track: React.FC = () => {
  const [tab, setTab] = useState<'request' | 'case'>('request');
  const [refNum, setRefNum] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const endpoint = tab === 'request' ? '/api/v1/service-requests/track' : '/api/v1/cases/track';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceNumber: refNum.trim(), phone: phone.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || 'Tracking failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Unable to track reference number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Track Status</h2>
        <p className="text-sm text-gray-600 mb-6">
          Check the real-time status of your submitted service request or feedback case.
        </p>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => { setTab('request'); setResult(null); setError(null); }}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              tab === 'request'
                ? 'border-gold-500 text-emerald-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Service Request (SR-...)
          </button>
          <button
            onClick={() => { setTab('case'); setResult(null); setError(null); }}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition ${
              tab === 'case'
                ? 'border-gold-500 text-emerald-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Case / Complaint (CS-...)
          </button>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
              Reference Number *
            </label>
            <input
              type="text"
              required
              value={refNum}
              onChange={(e) => setRefNum(e.target.value)}
              placeholder={tab === 'request' ? 'e.g. SR-2026-00001' : 'e.g. CS-2026-00001'}
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
              Verification Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number provided at submission"
              className="w-full p-2.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-emerald-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-md shadow transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Status'}
          </button>
        </form>

        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Reference:</span>
              <span className="font-mono font-bold text-emerald-900">{result.referenceNumber}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500">Current Status:</span>
              <span className="bg-gold-500/20 text-gold-600 border border-gold-500 font-bold px-3 py-1 rounded text-xs uppercase">
                {result.status}
              </span>
            </div>

            {result.serviceType && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-500">Service Type:</span>
                <span className="text-emerald-950 font-medium">{result.serviceType}</span>
              </div>
            )}

            {result.subject && (
              <div className="text-sm space-y-1">
                <span className="font-bold text-gray-500">Subject:</span>
                <p className="text-gray-800 bg-gray-50 p-2 rounded">{result.subject}</p>
              </div>
            )}

            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase text-emerald-900 mb-2">History / Timeline</h4>
              <div className="space-y-2">
                {result.history?.map((h: any, idx: number) => (
                  <div key={idx} className="text-xs bg-gray-50 p-2.5 rounded border border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-emerald-900">{h.toStatus}</span>
                      {h.notes && <p className="text-gray-600 mt-0.5">{h.notes}</p>}
                    </div>
                    <span className="text-gray-400 text-[10px]">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
