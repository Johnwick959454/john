import { Shield, UserCheck, Eye, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-serif font-bold text-emerald-900">Security Services</h1>
        <p className="text-gray-600 leading-relaxed">
          Comprehensive, disciplined physical and technical security solutions adapted to high-risk environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: 'Static Guarding',
            icon: Shield,
            desc: 'Uniformed guards for corporate headquarters, embassies, banks, and gated compounds with rigorous entry logging.',
          },
          {
            title: 'Event Security',
            icon: UserCheck,
            desc: 'Concert, conference, and sporting venue security management with crowd control specialists.',
          },
          {
            title: 'VIP & Escort',
            icon: Award,
            desc: 'Armed and unarmed executive protection details for VIP delegates, foreign dignitaries, and high-value transport.',
          },
          {
            title: 'CCTV & Perimeter Surveillance',
            icon: Eye,
            desc: 'Remote camera monitoring and rapid response team dispatch upon perimeter sensor triggers.',
          },
        ].map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <s.icon className="w-10 h-10 text-emerald-900" />
            <h3 className="text-xl font-serif font-bold text-emerald-900">{s.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            <Link
              to="/request-service"
              className="inline-block bg-gold-500 hover:bg-gold-600 text-emerald-950 px-4 py-2 rounded text-xs font-bold transition"
            >
              Request Quotation
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
