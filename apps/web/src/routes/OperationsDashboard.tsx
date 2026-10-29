import { FileText, AlertCircle, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export const OperationsDashboard: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, caseRes] = await Promise.all([
        fetch('/api/v1/service-requests', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/v1/cases', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (reqRes.ok) setRequests(await reqRes.json());
      if (caseRes.ok) setCases(await caseRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/service-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-emerald-900">Operations Control Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time service request and complaint management</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-emerald-900 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-emerald-950 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Service Requests</span>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{requests.length}</div>
          </div>
          <FileText className="w-8 h-8 text-emerald-900/30" />
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">New / Pending Requests</span>
            <div className="text-2xl font-bold text-gold-600 mt-1">
              {requests.filter((r) => r.status === 'NEW').length}
            </div>
          </div>
          <Clock className="w-8 h-8 text-gold-500/40" />
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Open Complaints / Cases</span>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {cases.filter((c) => c.status !== 'CLOSED').length}
            </div>
          </div>
          <AlertCircle className="w-8 h-8 text-red-500/30" />
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase">Resolved Cases</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              {cases.filter((c) => c.status === 'CLOSED').length}
            </div>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-700/30" />
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-serif font-bold text-emerald-900">Service Requests</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading records...</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200">
            <p className="font-medium">No service requests found in system.</p>
            <p className="text-xs mt-1">New submissions will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-900/5 border-b border-gray-200 text-xs uppercase text-emerald-900 font-bold">
                  <th className="p-3">Ref Number</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Service Type</th>
                  <th className="p-3">Site / City</th>
                  <th className="p-3">Guards</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-mono font-bold text-emerald-900">{r.referenceNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">{r.contactName}</div>
                      <div className="text-xs text-gray-500">{r.phone}</div>
                    </td>
                    <td className="p-3 font-medium text-gray-700">{r.serviceType}</td>
                    <td className="p-3 text-gray-600">{r.city}</td>
                    <td className="p-3 font-bold">{r.guardCount}</td>
                    <td className="p-3">
                      <span className="bg-gold-500/20 text-gold-700 border border-gold-500 font-bold px-2.5 py-0.5 rounded text-xs">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded p-1 outline-none bg-white font-medium"
                      >
                        <option value="NEW">NEW</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="SITE_ASSESSMENT_SCHEDULED">ASSESSMENT</option>
                        <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="CONTRACT_ACTIVE">CONTRACT_ACTIVE</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
