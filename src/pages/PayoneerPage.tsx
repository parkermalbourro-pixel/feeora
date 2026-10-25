import React, { useState } from 'react';
import { PageId, CalculationMode } from '../types';
import {
  calculatePayoneer,
  formatCurrency,
} from '../utils/calculator';
import {
  SUPPORTED_CURRENCIES,
  PAYONEER_FEE_ASSUMPTIONS,
} from '../data/feeRules';
import { FeeBreakdownCard } from '../components/FeeBreakdownCard';
import { ModeSelector } from '../components/ModeSelector';
import {
  Building2,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface PayoneerPageProps {
  onNavigate: (page: PageId) => void;
}

export const PayoneerPage: React.FC<PayoneerPageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState<number>(2000);
  const [mode, setMode] = useState<CalculationMode>('standard');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [receivingMethod, setReceivingMethod] = useState<'credit_card' | 'ach_debit' | 'receiving_accounts' | 'payoneer_to_payoneer'>('credit_card');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'none' | 'bank_fx' | 'bank_same_currency'>('bank_fx');

  const presets = [250, 500, 1000, 2000, 5000, 10000];

  const result = calculatePayoneer({
    amount: amount || 0,
    mode,
    currencyCode,
    receivingMethod,
    withdrawalMethod,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 transition-colors duration-200">
      {/* Header Breadcrumb & Title */}
      <div className="space-y-2">
        <nav className="text-xs text-[#686778] dark:text-[#B5B2C4] flex items-center gap-1.5">
          <button onClick={() => onNavigate('home')} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <span className="text-[#191725] dark:text-[#F7F6FC] font-semibold">Payoneer Fee Calculator</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191725] dark:text-[#F7F6FC]">
              Payoneer Fee Calculator
            </h1>
            <p className="text-xs text-[#686778] dark:text-[#B5B2C4]">
              Calculate Payoneer receiving fees, local bank withdrawal spreads, and reverse gross-up amounts for remote contractors.
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
                {mode === 'standard' ? 'Gross Payment Amount' : 'Target Net Desired in Bank'}
              </label>
              <span className="text-[11px] text-[#9593A5] dark:text-[#7E7B8F]">
                {mode === 'standard' ? 'Client invoice total' : 'Amount in your pocket'}
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
                placeholder="2000"
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
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold'
                      : 'bg-[#FAF9FC] dark:bg-[#15141E] border-[#E9E7EF] dark:border-[#333242] text-[#686778] dark:text-[#B5B2C4] hover:bg-[#F4F2F8]'
                  }`}
                >
                  {result.currencySymbol}{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1">
              Receiving Currency
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

          {/* Receiving Method */}
          <div>
            <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
              How will your client or platform pay?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReceivingMethod('credit_card')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  receivingMethod === 'credit_card'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">
                    Client Credit Card
                  </span>
                  <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">3.00%</span>
                </div>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  Client pays invoice via card
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReceivingMethod('ach_debit')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  receivingMethod === 'ach_debit'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">
                    ACH Bank Debit
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">1.00%</span>
                </div>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  US direct bank debit
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReceivingMethod('receiving_accounts')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  receivingMethod === 'receiving_accounts'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">
                    Global Payment Service
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">0% - 1%</span>
                </div>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  Local ACH/SEPA receiving accounts
                </span>
              </button>

              <button
                type="button"
                onClick={() => setReceivingMethod('payoneer_to_payoneer')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  receivingMethod === 'payoneer_to_payoneer'
                    ? 'border-[#6750D8] dark:border-[#B5A5FF] bg-[#F0EDFD]/60 dark:bg-[#262143]/60'
                    : 'border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC]">
                    Payoneer to Payoneer
                  </span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">0.00% Free</span>
                </div>
                <span className="block text-[10px] text-[#686778] dark:text-[#B5B2C4] mt-0.5">
                  Direct transfer between account holders
                </span>
              </button>
            </div>
          </div>

          {/* Local Bank Withdrawal Method */}
          <div className="pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
            <label className="block text-[11px] font-bold text-[#686778] dark:text-[#B5B2C4] mb-1.5">
              Withdrawal to Local Bank Account
            </label>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                <input
                  type="radio"
                  name="withdrawal"
                  value="bank_fx"
                  checked={withdrawalMethod === 'bank_fx'}
                  onChange={() => setWithdrawalMethod('bank_fx')}
                  className="mt-0.5 text-[#6750D8]"
                />
                <div>
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC] block">
                    Local Currency with FX spread (up to 2.0%)
                  </span>
                  <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                    Transferring into your non-USD home bank account
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                <input
                  type="radio"
                  name="withdrawal"
                  value="bank_same_currency"
                  checked={withdrawalMethod === 'bank_same_currency'}
                  onChange={() => setWithdrawalMethod('bank_same_currency')}
                  className="mt-0.5 text-[#6750D8]"
                />
                <div>
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC] block">
                    Same-Currency Bank Transfer ($1.50 flat)
                  </span>
                  <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                    Transferring USD to a USD bank account
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg border border-[#E9E7EF] dark:border-[#333242] bg-[#FAF9FC] dark:bg-[#15141E] cursor-pointer">
                <input
                  type="radio"
                  name="withdrawal"
                  value="none"
                  checked={withdrawalMethod === 'none'}
                  onChange={() => setWithdrawalMethod('none')}
                  className="mt-0.5 text-[#6750D8]"
                />
                <div>
                  <span className="font-bold text-[#191725] dark:text-[#F7F6FC] block">
                    Keep Balance in Payoneer ($0.00)
                  </span>
                  <span className="text-[10px] text-[#686778] dark:text-[#B5B2C4]">
                    Use directly for card spend or contractor payouts
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 sticky top-20 space-y-3">
          <FeeBreakdownCard result={result} providerDisplayName="Payoneer" />

          {/* Alert Box */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1 transition-colors">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Annual Inactivity Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Payoneer charges an annual <strong>$29.95 fee</strong> if your account is active for 12 months and you receive less than $2,000.00 in total across that period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
