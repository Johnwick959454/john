import { Building, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export const ClientPortal: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reopenReason, setReopenReason] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'cases' | 'sites'>('requests');

  const token = localStorage.getItem('token');

  const fetchPortalData = async () => {
    setLoading(true);
    try {
      const [ovRes, reqRes, caseRes, siteRes] = await Promise.all([
        fetch('/api/v1/client-portal/overview', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/client-portal/requests', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/client-portal/cases', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/client-portal/sites', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
      if (caseRes.ok) setCases(await caseRes.json());
      if (siteRes.ok) setSites(await siteRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  const handleReopen = async (caseId: string) => {
    if (!reopenReason.trim()) return;
    try {
      const res = await fetch(`/api/v1/client-portal/cases/${caseId}/reopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reopenReason }),
      });
      if (res.ok) {
        setReopenReason('');
        fetchPortalData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-emerald-900">
            {overview?.client?.companyName || 'Client Workspace Portal'}
          </h1>
          <p className="text-sm text-gray-600">Authorized Client Management & Case Tracking</p>
        </div>
        <button
          onClick={fetchPortalData}
          className="flex items-center gap-2 bg-emerald-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-emerald-950 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Total Service Requests</span>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {overview?.stats?.totalRequests || 0}
            </div>
          </div>
          <FileText className="w-8 h-8 text-emerald-900/30" />
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Active Cases / Complaints</span>
            <div className="text-2xl font-bold text-gold-600 mt-1">
              {overview?.stats?.openCases || 0}
            </div>
          </div>
          <AlertCircle className="w-8 h-8 text-gold-500/40" />
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Authorized Sites</span>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {overview?.stats?.authorizedSites || 0}
            </div>
          </div>
          <Building className="w-8 h-8 text-emerald-900/30" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'requests'
              ? 'border-gold-500 text-emerald-900'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Service Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'cases'
              ? 'border-gold-500 text-emerald-900'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Feedback & Cases ({cases.length})
        </button>
        <button
          onClick={() => setActiveTab('sites')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'sites'
              ? 'border-gold-500 text-emerald-900'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Authorized Sites ({sites.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading client records...</p>
      ) : activeTab === 'requests' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {requests.length === 0 ? (
            <p className="text-sm text-gray-500">No service requests submitted under your client profile.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.id} className="p-4 border border-gray-100 rounded bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="font-mono font-bold text-emerald-900 text-sm">{r.referenceNumber}</span>
                    <h4 className="font-bold text-gray-800 text-base">{r.serviceType}</h4>
                    <p className="text-xs text-gray-500">{r.siteAddress}, {r.city} ({r.guardCount} guards)</p>
                  </div>
                  <span className="bg-gold-500/20 text-gold-700 border border-gold-500 font-bold px-3 py-1 rounded text-xs">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'cases' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
          {cases.length === 0 ? (
            <p className="text-sm text-gray-500">No feedback cases or complaints recorded.</p>
          ) : (
            cases.map((c) => (
              <div key={c.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-emerald-900 text-xs">{c.referenceNumber}</span>
                    <h4 className="font-bold text-gray-800">{c.subject}</h4>
                  </div>
                  <span className="bg-gold-500/20 text-gold-700 border border-gold-500 font-bold px-2.5 py-0.5 rounded text-xs uppercase">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{c.description}</p>

                {c.status === 'CLOSED' && (
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Reason to reopen case..."
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      className="text-xs p-1.5 border border-gray-300 rounded flex-1 outline-none"
                    />
                    <button
                      onClick={() => handleReopen(c.id)}
                      className="bg-emerald-900 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-emerald-950 transition"
                    >
                      Reopen (Within 7 Days)
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {sites.length === 0 ? (
            <p className="text-sm text-gray-500">No sites currently assigned to your account.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sites.map((s) => (
                <div key={s.id} className="p-4 border border-gray-200 rounded-lg space-y-2">
                  <h4 className="font-bold text-emerald-900">{s.name}</h4>
                  <p className="text-xs text-gray-600">{s.address}, {s.city}</p>
                  <p className="text-[10px] text-gray-400 font-mono">Geofence Radius: {s.geofenceRadius}m</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
