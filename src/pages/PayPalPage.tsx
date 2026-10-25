import React, { useState } from 'react';
import { PageId, CalculationMode } from '../types';
import {
  calculatePayPal,
  formatCurrency,
} from '../utils/calculator';
import {
  SUPPORTED_REGIONS,
  SUPPORTED_CURRENCIES,
} from '../data/feeRules';
import { FeeBreakdownCard } from '../components/FeeBreakdownCard';
import { ModeSelector } from '../components/ModeSelector';
import {
  CreditCard,
  ArrowRight,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface PayPalPageProps {
  onNavigate: (page: PageId) => void;
}

export const PayPalPage: React.FC<PayPalPageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [mode, setMode] = useState<CalculationMode>('standard');
  const [regionCode, setRegionCode] = useState<string>('US');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [transactionType, setTransactionType] = useState<'invoicing' | 'checkout' | 'qr_code'>('invoicing');
  const [isInternational, setIsInternational] = useState<boolean>(true);
  const [hasCurrencyConversion, setHasCurrencyConversion] = useState<boolean>(false);

  const presets = [100, 250, 500, 1000, 2500, 5000];

  const result = calculatePayPal({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    transactionType,
    isInternational,
    hasCurrencyConversion,
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
          <span className="text-[#191725] dark:text-[#F7F6FC] font-semibold">PayPal Fee Calculator</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
              PayPal Fee Calculator
            </h1>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
              Estimate domestic & international commercial invoicing rates, cross-border surcharges, and reverse payouts.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Results on Right */}
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
                {mode === 'standard' ? 'Gross Invoice Amount' : 'Target Net Payout Desired'}
              </label>
              <span className="text-[11px] text-[#9593A5] dark:text-[#7E7B8F]">
                {mode === 'standard' ? 'Amount client will send' : 'Amount in your pocket'}
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

          {/* Region and Currency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
                Merchant Country / Region
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
                Billing Currency
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

          {/* Transaction Type */}
          <div>
            <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
              PayPal Transaction Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('invoicing')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  transactionType === 'invoicing'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">
                  Invoicing
                </span>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                  Standard commercial
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType('checkout')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  transactionType === 'checkout'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">
                  Online Checkout
                </span>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                  PayPal website button
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType('qr_code')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  transactionType === 'qr_code'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <span className="block font-bold text-[#191725] dark:text-[#F7F6FC]">
                  QR Code Payment
                </span>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                  In-person scan
                </span>
              </button>
            </div>
          </div>

          {/* Cross Border & FX Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
              <input
                type="checkbox"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                className="mt-0.5 rounded text-[#6750D8] focus:ring-[#6750D8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#191725] dark:text-[#F7F6FC] block">
                  International Transaction (Cross-Border Surcharge +1.50%)
                </span>
                <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  Add standard surcharge for foreign cardholders
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
                  Currency Conversion Spread (+3.50%)
                </span>
                <span className="text-[11px] text-[#686778] dark:text-[#B5B2C4]">
                  Check if client pays in a currency different from your deposit balance
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 sticky top-20">
          <FeeBreakdownCard result={result} providerDisplayName="PayPal" />

          {/* Quick cross-link */}
          <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] text-xs flex items-center justify-between transition-colors">
            <span className="text-[#686778] dark:text-[#B5B2C4]">Considering Stripe instead?</span>
            <button
              onClick={() => onNavigate('stripe')}
              className="text-[#6750D8] dark:text-[#B5A5FF] font-bold hover:underline flex items-center gap-1"
            >
              <span>Compare with Stripe</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Worked Step-by-Step Example Section */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 space-y-3 shadow-soft transition-colors">
        <h2 className="text-lg font-extrabold text-[#191725] dark:text-[#F7F6FC]">
          Worked Example: Billing an International Client $1,500 via PayPal
        </h2>
        <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] text-xs text-[#191725] dark:text-[#F7F6FC] space-y-2">
          <p className="text-[#686778] dark:text-[#B5B2C4]">
            <strong>Scenario:</strong> You are a US freelance web designer sending an invoice for <strong>$1,500.00 USD</strong> to a client located in the UK.
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#686778] dark:text-[#B5B2C4]">
            <li><strong>Base US Invoicing Rate:</strong> 2.99% &times; $1,500 = $44.85</li>
            <li><strong>Fixed Transaction Fee:</strong> $0.49</li>
            <li><strong>Cross-Border Surcharge:</strong> +1.50% &times; $1,500 = $22.50</li>
            <li><strong>Total PayPal Fee:</strong> $44.85 + $0.49 + $22.50 = <strong className="text-rose-600 dark:text-rose-400">$67.84</strong> (4.52% effective)</li>
            <li><strong>Net Payout Received:</strong> $1,500.00 - $67.84 = <strong className="text-emerald-600 dark:text-emerald-400">$1,432.16 USD</strong></li>
          </ul>
        </div>
      </section>

      {/* PayPal Fee Schedule Table */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 space-y-3 shadow-soft transition-colors">
        <h2 className="text-lg font-extrabold text-[#191725] dark:text-[#F7F6FC]">
          Verified PayPal Merchant Fee Table (Q1 2025)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9FC] dark:bg-[#15141E] text-[#191725] dark:text-[#F7F6FC] border-y border-[#E9E7EF] dark:border-[#333242] font-semibold">
                <th className="p-2.5">Region</th>
                <th className="p-2.5">Invoicing / Commercial</th>
                <th className="p-2.5">Standard Checkout</th>
                <th className="p-2.5">International Surcharge</th>
                <th className="p-2.5">Fixed Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7EF] dark:divide-[#333242] text-[#686778] dark:text-[#B5B2C4]">
              <tr>
                <td className="p-2.5 font-semibold text-[#191725] dark:text-[#F7F6FC]">United States (USD)</td>
                <td className="p-2.5">2.99%</td>
                <td className="p-2.5">3.49%</td>
                <td className="p-2.5">+1.50%</td>
                <td className="p-2.5 font-mono">$0.49</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#191725] dark:text-[#F7F6FC]">United Kingdom (GBP)</td>
                <td className="p-2.5">2.90%</td>
                <td className="p-2.5">2.90%</td>
                <td className="p-2.5">+1.99% (EEA) / +2.00%</td>
                <td className="p-2.5 font-mono">£0.39</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-[#191725] dark:text-[#F7F6FC]">Eurozone (EUR)</td>
                <td className="p-2.5">2.90%</td>
                <td className="p-2.5">2.90%</td>
                <td className="p-2.5">+1.99% / +2.00%</td>
                <td className="p-2.5 font-mono">€0.39</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
