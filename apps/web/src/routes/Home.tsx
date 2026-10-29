import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Eye, Award, CheckCircle, ArrowRight, Building, Clock, Lock } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b-2 border-gold-500/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500 text-gold-500 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              <Lock className="w-3 h-3" /> Uncompromising Security
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight leading-tight">
              Disciplined Protection for Your <span className="text-gold-500">Assets & Peace of Mind</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Covenant Shield provides high-caliber security guard personnel, real-time site surveillance, VIP escort services, and rapid response units across East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/request-service"
                className="bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold px-6 py-3.5 rounded-md shadow-lg flex items-center justify-center gap-2 transition"
              >
                Request Security Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-700 font-semibold px-6 py-3.5 rounded-md flex items-center justify-center transition"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="bg-emerald-900/50 p-8 rounded-xl border border-gold-500/20 backdrop-blur shadow-2xl relative">
            <h3 className="text-xl font-serif font-bold text-gold-500 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-500" /> Covenant Shield Guarantee
            </h3>
            <ul className="space-y-4">
              {[
                'Vetted and highly trained security personnel',
                '24/7 Operations command and GPS attendance verification',
                'Transparent complaint resolution within 48 hours',
                'Tailored static guarding and VIP escort solutions',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Core Services Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-serif text-emerald-900">Our Professional Services</h2>
          <p className="text-surface-text/80 mt-2 text-sm">
            Tailored security management solutions built upon discipline, technology, and rigorous standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Static Guarding',
              icon: ShieldCheck,
              desc: 'Dedicated physical security guards assigned to residential, commercial, and industrial facilities with digital check-in protocols.',
            },
            {
              title: 'Event Security',
              icon: UserCheck,
              desc: 'Crowd management, access point control, and executive safety for high-profile gatherings and corporate events.',
            },
            {
              title: 'VIP & Escort',
              icon: Award,
              desc: 'Discrete, trained bodyguards and armed escort details for high-net-worth individuals, diplomats, and delegation transport.',
            },
            {
              title: 'Patrol Services',
              icon: Clock,
              desc: 'Scheduled mobile patrols equipped with live GPS tracking ensuring visible deterrence and swift alarm response.',
            },
            {
              title: 'CCTV Monitoring',
              icon: Eye,
              desc: '24/7 centralized video surveillance and automated site perimeter anomaly detection.',
            },
            {
              title: 'Corporate Safety',
              icon: Building,
              desc: 'Comprehensive risk assessments, safety plan formulation, and ongoing facility security audits.',
            },
          ].map((srv, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gold-500/50 transition flex flex-col justify-between"
            >
              <div>
                <srv.icon className="w-10 h-10 text-emerald-900 mb-4" />
                <h3 className="text-lg font-bold text-emerald-900 mb-2">{srv.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{srv.desc}</p>
              </div>
              <Link
                to="/request-service"
                className="mt-6 text-emerald-900 font-semibold text-sm hover:text-gold-500 inline-flex items-center gap-1"
              >
                Request Quote <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
