import React, { useState } from 'react';
import { PageId, CalculationMode } from '../types';
import {
  calculateStripe,
  formatCurrency,
} from '../utils/calculator';
import {
  SUPPORTED_REGIONS,
  SUPPORTED_CURRENCIES,
} from '../data/feeRules';
import { FeeBreakdownCard } from '../components/FeeBreakdownCard';
import { ModeSelector } from '../components/ModeSelector';
import {
  Zap,
  ArrowRight,
  Info,
  ChevronRight,
} from 'lucide-react';

interface StripePageProps {
  onNavigate: (page: PageId) => void;
}

export const StripePage: React.FC<StripePageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [mode, setMode] = useState<CalculationMode>('standard');
  const [regionCode, setRegionCode] = useState<string>('US');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [isInternationalCard, setIsInternationalCard] = useState<boolean>(true);
  const [hasCurrencyConversion, setHasCurrencyConversion] = useState<boolean>(false);
  const [isInvoicingPlus, setIsInvoicingPlus] = useState<boolean>(false);

  const presets = [100, 250, 500, 1000, 2500, 5000];

  const result = calculateStripe({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    isInternationalCard,
    hasCurrencyConversion,
    isInvoicingPlus,
  });

  const handleRegionChange = (newRegion: string) => {
    setRegionCode(newRegion);
    const regionObj = SUPPORTED_REGIONS.find((r) => r.code === newRegion);
    if (regionObj && regionObj.currency) {
      setCurrencyCode(regionObj.currency);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 transition-colors duration-200">
      {/* Header Breadcrumb & Title */}
      <div className="space-y-2">
        <nav className="text-xs text-[#686778] dark:text-[#B5B2C4] flex items-center gap-1.5">
          <button onClick={() => onNavigate('home')} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <span className="text-[#191725] dark:text-[#F7F6FC] font-semibold">Stripe Fee Calculator</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
              Stripe Fee Calculator
            </h1>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
              Calculate credit card processing, cross-border surcharges, currency conversion fees, and reverse invoice totals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-5 sm:p-7 space-y-5 shadow-card transition-colors">
          {/* Mode Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] mb-1.5">
              Calculation Type
            </label>
            <ModeSelector mode={mode} onChange={setMode} />
          </div>

          {/* Amount Input with presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4]">
                {mode === 'standard' ? 'Gross Charge Amount' : 'Target Net Payout Desired'}
              </label>
              <span className="text-[11px] text-[#9593A5] dark:text-[#7E7B8F]">
                {mode === 'standard' ? 'Amount charged to client' : 'Net deposited in bank'}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#9593A5] dark:text-[#7E7B8F] font-mono">
                {result.currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                step="10"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="1000"
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] rounded-xl font-mono text-lg font-bold text-[#191725] dark:text-[#F7F6FC] focus:outline-none focus:ring-2 focus:ring-[#6750D8]"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#9593A5] dark:text-[#7E7B8F] mr-1">Presets:</span>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border font-mono font-medium transition-colors ${
                    amount === p
                      ? 'bg-[#F0EDFD] dark:bg-[#262143] border-[#6750D8]/40 dark:border-[#B5A5FF]/40 text-[#6750D8] dark:text-[#B5A5FF] font-bold'
                      : 'bg-[#FAF9FC] dark:bg-[#15141E] border-[#E9E7EF] dark:border-[#333242] text-[#686778] dark:text-[#B5B2C4] hover:bg-[#F4F2F8]'
                  }`}
                >
                  {result.currencySymbol}{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Region and Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
                Stripe Account Country
              </label>
              <select
                value={regionCode}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-xs font-semibold text-[#191725] dark:text-[#F7F6FC] bg-white dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8]"
              >
                {SUPPORTED_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
                Charge Currency
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-xs font-semibold text-[#191725] dark:text-[#F7F6FC] bg-white dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8]"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card Origin & Features */}
          <div className="space-y-2 pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
              <input
                type="checkbox"
                checked={isInternationalCard}
                onChange={(e) => setIsInternationalCard(e.target.checked)}
                className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                  International Card (+1.50% to +1.75% surcharge)
                </span>
                <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  Card issued outside your merchant country
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
              <input
                type="checkbox"
                checked={hasCurrencyConversion}
                onChange={(e) => setHasCurrencyConversion(e.target.checked)}
                className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                  Currency Conversion (+1.00% to +2.00%)
                </span>
                <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  Settlement currency differs from invoice currency
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
              <input
                type="checkbox"
                checked={isInvoicingPlus}
                onChange={(e) => setIsInvoicingPlus(e.target.checked)}
                className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                  Stripe Invoicing Plus (+0.40%)
                </span>
                <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  Optional advanced automated invoicing workflows
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <FeeBreakdownCard result={result} providerDisplayName="Stripe" />

          {/* Quick link */}
          <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] text-xs flex items-center justify-between transition-colors">
            <span className="text-[#686778] dark:text-[#B5B2C4]">Compare PayPal vs Stripe?</span>
            <button
              onClick={() => onNavigate('compare')}
              className="text-[#6750D8] dark:text-[#B5A5FF] font-bold hover:underline flex items-center gap-1"
            >
              <span>3-Way Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Worked Example */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 space-y-3 shadow-soft transition-colors">
        <h2 className="text-lg font-extrabold text-[#191725] dark:text-[#F7F6FC]">
          Worked Example: Charging $1,000 to an International Client via Stripe
        </h2>
        <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-xs text-[#191725] dark:text-[#F7F6FC] space-y-2">
          <p className="text-[#686778] dark:text-[#B5B2C4]">
            <strong>Scenario:</strong> You run a US business and charge an overseas client <strong>$1,000.00 USD</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#686778] dark:text-[#B5B2C4]">
            <li><strong>Base Card Processing:</strong> 2.9% &times; $1,000 = $29.00</li>
            <li><strong>Fixed Transaction Fee:</strong> $0.30</li>
            <li><strong>International Card Surcharge:</strong> +1.50% &times; $1,000 = $15.00</li>
            <li><strong>Total Stripe Fee:</strong> $29.00 + $0.30 + $15.00 = <strong className="text-rose-600 dark:text-rose-400">$44.30 USD</strong> (4.43% effective)</li>
            <li><strong>Net Deposited to Bank:</strong> $1,000.00 - $44.30 = <strong className="text-emerald-600 dark:text-emerald-400">$955.70 USD</strong></li>
          </ul>
        </div>
      </section>
    </div>
  );
};
