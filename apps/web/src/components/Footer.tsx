import React from 'react';
import { Logo } from './Logo';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <Logo className="h-10 mb-4" />
          <p className="text-gray-300 text-sm leading-relaxed">
            Covenant Shield Security Services delivers disciplined, professional, and uncompromising security guard and escort solutions across East Africa.
          </p>
        </div>

        <div>
          <h4 className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/services" className="hover:text-gold-500 transition">Static Guarding</a></li>
            <li><a href="/services" className="hover:text-gold-500 transition">Event Security</a></li>
            <li><a href="/services" className="hover:text-gold-500 transition">VIP & Escort</a></li>
            <li><a href="/services" className="hover:text-gold-500 transition">CCTV Monitoring</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-4">Client Support</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/request-service" className="hover:text-gold-500 transition">Request Service Quotation</a></li>
            <li><a href="/feedback" className="hover:text-gold-500 transition">Submit Complaint / Feedback</a></li>
            <li><a href="/track" className="hover:text-gold-500 transition">Track Status</a></li>
            <li><a href="/login" className="hover:text-gold-500 transition">Client Portal Login</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-4">Contact HQ</h4>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
              <span>Bole Road, Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-500 shrink-0" />
              <span>+251 911 000 000 / +251 116 000 000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-500 shrink-0" />
              <span>info@covenantshield.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Covenant Shield Security Services. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-1">
          <Shield className="h-3 w-3 text-gold-500" /> Premium Security Management Platform
        </p>
      </div>
    </footer>
  );
};
