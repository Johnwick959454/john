import { ServiceType, ShiftCoverage } from '@covenant-shield/shared';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export const RequestService: React.FC = () => {
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    contactName: '',
    organizationName: '',
    phone: '',
    email: '',
    serviceType: ServiceType.STATIC_GUARDING,
    siteAddress: '',
    city: 'Addis Ababa',
    guardCount: 1,
    shiftCoverage: ShiftCoverage.DAY,
    isArmed: false,
    duration: '1 month',
    additionalDetails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'guardCount') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName || !formData.phone || !formData.siteAddress || !formData.city) {
      setErrorMsg('Please fill in all required fields (*)');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await res.json();
      setSuccessRef(result.referenceNumber);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Request Security Services</h2>
        <p className="text-sm text-gray-600 mb-6">
          Fill out the form below to receive an official assessment and quotation.
        </p>

        {successRef ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-emerald-900 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="text-xl font-bold">Request Submitted Successfully!</h3>
            <p className="text-sm text-gray-700">
              Your unique tracking reference number is:
            </p>
            <div className="text-2xl font-mono font-bold text-emerald-900 bg-emerald-100 py-2 px-4 rounded inline-block">
              {successRef}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              Please save this reference number. You can track your request status using your reference and phone number.
            </p>
            <button
              onClick={() => setSuccessRef(null)}
              className="mt-4 bg-emerald-900 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-emerald-950 transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Full Contact Name *
                </label>
                <input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="e.g. Solomon Tesfaye"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Organization / Company Name
                </label>
                <input
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="+251 911 223344"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                >
                  <option value={ServiceType.STATIC_GUARDING}>Static Guarding</option>
                  <option value={ServiceType.EVENT_SECURITY}>Event Security</option>
                  <option value={ServiceType.VIP_ESCORT}>VIP / Escort Services</option>
                  <option value={ServiceType.PATROL_SERVICES}>Patrol Services</option>
                  <option value={ServiceType.CCTV_MONITORING}>CCTV Monitoring</option>
                  <option value={ServiceType.OTHER}>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Shift Coverage *
                </label>
                <select
                  name="shiftCoverage"
                  value={formData.shiftCoverage}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                >
                  <option value={ShiftCoverage.DAY}>Day Shift</option>
                  <option value={ShiftCoverage.NIGHT}>Night Shift</option>
                  <option value={ShiftCoverage.TWENTY_FOUR_HOUR}>24-Hour Coverage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Site Address *
                </label>
                <input
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="Site / Facility Address"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  City *
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                  placeholder="e.g. Addis Ababa"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Number of Guards Required *
                </label>
                <input
                  type="number"
                  name="guardCount"
                  value={formData.guardCount}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                >
                  <option value="One-off Event">One-off Event</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="12 months">12 Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-emerald-900 mb-1">
                Additional Details
              </label>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-900 outline-none"
                placeholder="Specific site requirements, entry restrictions, or details..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3 rounded-md shadow transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Service Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
