import React from 'react';
import { PageId } from '../types';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 transition-colors duration-200">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Tracking &bull; 100% In-Browser</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#686778] dark:text-[#B5B2C4]">
          Last Updated: January 2025 &bull; Effective Immediately
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ServerOff className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm">No Server Database</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            All arithmetic and fee calculations occur exclusively in your browser memory. We maintain no backend database of user calculations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm">No Financial Data Stored</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            We never prompt for or store bank account numbers, credit card details, API keys, or personal identity credentials.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-2 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-[#FDF0F7] dark:bg-[#3D1E30] text-[#E96DAF] dark:text-[#F29BCB] flex items-center justify-center font-bold">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm">No Tracking Cookies</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            Feeora does not employ invasive advertising cookies, third-party pixel trackers, or cross-site fingerprinting scripts.
          </p>
        </div>
      </div>

      {/* Detailed Legal Text */}
      <div className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-6 text-sm text-[#191725] dark:text-[#F7F6FC] leading-relaxed shadow-soft transition-colors">
        <h2 className="text-lg font-bold text-[#191725] dark:text-[#F7F6FC]">1. Information We Do Not Collect</h2>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          Feeora is intentionally designed without user authentication, registration forms, or backend persistence. When you type numbers into our calculator fields (e.g. $1,000, currency options, country choices), that data remains solely within your device&apos;s transient browser memory. It is never transmitted across the network or logged on our infrastructure.
        </p>

        <h2 className="text-lg font-bold text-[#191725] dark:text-[#F7F6FC]">2. Third-Party Links & Sources</h2>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          Our calculators feature links to official fee documentation published by third parties (e.g. PayPal, Payoneer, Stripe). Once you navigate to external websites, their respective privacy policies and terms apply. We encourage you to review their policies directly.
        </p>

        <h2 className="text-lg font-bold text-[#191725] dark:text-[#F7F6FC]">3. Local Storage Usage</h2>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          We store your visual theme preference (Light or Dark Mode) in local browser storage so your display preference is remembered across visits. No personal identifiers or calculation values are ever written to localStorage.
        </p>

        <h2 className="text-lg font-bold text-[#191725] dark:text-[#F7F6FC]">4. Contact & Inquiries</h2>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          If you have questions regarding this Privacy Policy or wish to verify our client-side architecture, please visit our{' '}
          <button
            onClick={() => onNavigate('contact')}
            className="text-[#6750D8] dark:text-[#B5A5FF] font-semibold hover:underline"
          >
            Contact page
          </button>.
        </p>
      </div>
    </div>
  );
};
