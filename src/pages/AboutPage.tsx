import React from 'react';
import { PageId } from '../types';
import { FeeoraLogo } from '../components/FeeoraLogo';
import {
  ShieldCheck,
  Calculator,
  Globe2,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  onOpenTestingGuide: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenTestingGuide }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-colors duration-200">
      {/* Title */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0EDFD] dark:bg-[#262143] border border-[#6750D8]/20 text-xs font-semibold text-[#6750D8] dark:text-[#B5A5FF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>About Feeora</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
          Know the fee. Keep more of your money.
        </h1>
        <p className="text-sm sm:text-base text-[#686778] dark:text-[#B5B2C4] leading-relaxed max-w-2xl">
          Feeora is an independent, zero-cost financial intelligence tool built for international freelancers, agencies, and online sellers who need transparent transaction fee math before billing clients.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-base">Zero-Dollar Architecture</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            We use no paid APIs, no expensive external servers, and no costly database dependencies. This ensures Feeora remains 100% free and accessible to everyone worldwide forever.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-base">Privacy by Architecture</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            All calculations execute entirely in your web browser memory. We never store your invoice amounts, collect financial information, or track user activity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] shadow-soft space-y-3 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#FDF0F7] dark:bg-[#3D1E30] text-[#E96DAF] dark:text-[#F29BCB] flex items-center justify-center font-bold">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-base">Independent Verification</h2>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            We never invent fee rules. Every rate is cited with its official source link, last-verified date, and assumptions so you can independently audit the math.
          </p>
        </div>
      </div>

      {/* Our Story & Methodology */}
      <div className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-6 text-sm text-[#191725] dark:text-[#F7F6FC] leading-relaxed shadow-soft transition-colors">
        <h2 className="text-xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
          Why We Built Feeora
        </h2>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          International freelancers and remote contractors frequently discover that after completing a $1,000 or $3,000 project, their actual bank deposit is 4% to 8% less than expected. Payment gateways layer base processing fees, international cross-border card surcharges, fixed per-transaction fees, and foreign exchange (FX) conversion spreads.
        </p>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          Most calculators online are cluttered with intrusive ads, affiliate redirects, or outdated rates. Feeora was engineered to provide clean, fast, mobile-friendly tools with both <strong>standard payout estimation</strong> and <strong>reverse gross-up calculation</strong> so you know exactly what to invoice.
        </p>

        <h3 className="text-base font-bold text-[#191725] dark:text-[#F7F6FC] pt-2">
          How Fee Schedules Are Maintained
        </h3>
        <p className="text-[#686778] dark:text-[#B5B2C4]">
          Our fee schedules are compiled from official pricing documentation across PayPal, Payoneer, and Stripe. Every calculation displays the exact date the schedule was verified and a direct link to the official pricing page.
        </p>

        <div className="pt-4 border-t border-[#E9E7EF] dark:border-[#333242] flex flex-wrap gap-4 items-center justify-between">
          <button
            onClick={onOpenTestingGuide}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] hover:bg-[#6750D8] hover:text-white dark:hover:bg-[#B5A5FF] dark:hover:text-[#11111A] border border-[#6750D8]/20 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Read Testing & Free Deployment Guide</span>
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="text-xs font-bold text-[#686778] dark:text-[#B5B2C4] hover:text-[#6750D8] dark:hover:text-[#B5A5FF] underline"
          >
            Submit a Fee Schedule Correction &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
