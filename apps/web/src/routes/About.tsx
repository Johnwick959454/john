import React from 'react';
import { ShieldCheck, Award, Eye } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-serif font-bold text-emerald-900">About Covenant Shield</h1>
        <p className="text-gray-600 leading-relaxed">
          Established to deliver high-trust, disciplined security guard personnel and real-time operational surveillance for corporate, industrial, and diplomatic clients across East Africa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <ShieldCheck className="w-12 h-12 text-emerald-900 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-emerald-900 mb-2">Rigorous Vetting</h3>
          <p className="text-gray-600 text-sm">
            Every guard undergoes background screening, physical endurance tests, and formal ethics training.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <Eye className="w-12 h-12 text-gold-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-emerald-900 mb-2">Digital Operations</h3>
          <p className="text-gray-600 text-sm">
            GPS geofencing, QR check-in verification, and real-time attendance exception tracking.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <Award className="w-12 h-12 text-emerald-900 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-emerald-900 mb-2">Uncompromising Integrity</h3>
          <p className="text-gray-600 text-sm">
            Disciplined chain-of-command and rapid resolution for all client requests and complaints.
          </p>
        </div>
      </div>
    </div>
  );
};
