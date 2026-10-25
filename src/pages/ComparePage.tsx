import React, { useState } from 'react';
import { PageId, CalculationMode } from '../types';
import {
  calculatePayPal,
  calculatePayoneer,
  calculateStripe,
  formatCurrency,
} from '../utils/calculator';
import {
  SUPPORTED_REGIONS,
  SUPPORTED_CURRENCIES,
} from '../data/feeRules';
import { ModeSelector } from '../components/ModeSelector';
import {
  ArrowRightLeft,
  CreditCard,
  Building2,
  Zap,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

interface ComparePageProps {
  onNavigate: (page: PageId) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState<number>(1000);
  const [mode, setMode] = useState<CalculationMode>('standard');
  const [regionCode, setRegionCode] = useState<string>('US');
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [isCrossBorder, setIsCrossBorder] = useState<boolean>(true);
  const [hasFxSpread, setHasFxSpread] = useState<boolean>(false);

  const presets = [250, 500, 1000, 2500, 5000, 10000];

  // Calculate PayPal
  const paypalResult = calculatePayPal({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    transactionType: 'invoicing',
    isInternational: isCrossBorder,
    hasCurrencyConversion: hasFxSpread,
  });

  // Calculate Payoneer
  const payoneerResult = calculatePayoneer({
    amount: amount || 0,
    mode,
    currencyCode,
    receivingMethod: 'credit_card',
    withdrawalMethod: hasFxSpread ? 'bank_fx' : isCrossBorder ? 'bank_same_currency' : 'none',
  });

  // Calculate Stripe
  const stripeResult = calculateStripe({
    amount: amount || 0,
    mode,
    regionCode,
    currencyCode,
    isInternationalCard: isCrossBorder,
    hasCurrencyConversion: hasFxSpread,
    isInvoicingPlus: false,
  });

  // Determine lowest fee provider
  const options = [
    { id: 'paypal' as const, name: 'PayPal', result: paypalResult, fee: paypalResult.totalFee },
    { id: 'payoneer' as const, name: 'Payoneer', result: payoneerResult, fee: payoneerResult.totalFee },
    { id: 'stripe' as const, name: 'Stripe', result: stripeResult, fee: stripeResult.totalFee },
  ];

  const sortedByFee = [...options].sort((a, b) => a.fee - b.fee);
  const lowestFeeOption = sortedByFee[0];
  const highestFeeOption = sortedByFee[sortedByFee.length - 1];
  const maxSavings = Math.round((highestFeeOption.fee - lowestFeeOption.fee) * 100) / 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 transition-colors duration-200">
      {/* Header Breadcrumb & Title */}
      <div className="space-y-3">
        <nav className="text-xs text-[#686778] dark:text-[#B5B2C4] flex items-center gap-1.5">
          <button onClick={() => onNavigate('home')} className="hover:underline">
            Home
          </button>
          <span>/</span>
          <span className="text-[#191725] dark:text-[#F7F6FC] font-semibold">Compare Payment Fees</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] border border-[#6750D8]/20 flex items-center justify-center font-bold">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
              Compare International Payment Fees
            </h1>
            <p className="text-xs sm:text-sm text-[#686778] dark:text-[#B5A5FF]/80">
              Side-by-side comparison of PayPal, Payoneer, and Stripe fees for global invoices and cross-border card transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Amount, Mode, Region, Options */}
      <div className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-6 shadow-soft transition-colors">
        <div className="max-w-xl">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#686778] dark:text-[#B5B2C4] mb-2">
            Calculation Mode
          </label>
          <ModeSelector mode={mode} onChange={setMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1.5">
              {mode === 'standard' ? 'Gross Invoice Amount' : 'Target Net Payout Desired'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#9593A5] font-mono">
                {paypalResult.currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                step="10"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="1000"
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] rounded-xl font-mono text-base font-bold text-[#191725] dark:text-[#F7F6FC] focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
              />
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-1 mt-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-mono transition-colors ${
                    amount === p
                      ? 'bg-[#6750D8] text-white border-[#6750D8] font-bold'
                      : 'bg-white dark:bg-[#15141E] border-[#E9E7EF] dark:border-[#333242] text-[#686778] dark:text-[#B5B2C4] hover:border-[#6750D8]'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1.5">
              Merchant Country
            </label>
            <select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-sm font-medium text-[#191725] dark:text-[#F7F6FC] bg-[#FAF9FC] dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
            >
              {SUPPORTED_REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.flag} {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-bold text-[#191725] dark:text-[#F7F6FC] mb-1.5">
              Invoice Currency
            </label>
            <select
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="w-full py-2.5 px-3 border border-[#E9E7EF] dark:border-[#333242] rounded-xl text-sm font-medium text-[#191725] dark:text-[#F7F6FC] bg-[#FAF9FC] dark:bg-[#15141E] focus:outline-none focus:ring-2 focus:ring-[#6750D8] dark:focus:ring-[#B5A5FF]"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#E9E7EF] dark:border-[#333242] text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCrossBorder}
              onChange={(e) => setIsCrossBorder(e.target.checked)}
              className="w-4 h-4 rounded text-[#6750D8] focus:ring-[#6750D8] border-[#E9E7EF] dark:border-[#333242]"
            />
            <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">
              International payment (Cross-border card)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFxSpread}
              onChange={(e) => setHasFxSpread(e.target.checked)}
              className="w-4 h-4 rounded text-[#6750D8] focus:ring-[#6750D8] border-[#E9E7EF] dark:border-[#333242]"
            />
            <span className="font-semibold text-[#191725] dark:text-[#F7F6FC]">
              Include foreign exchange (FX) conversion spread
            </span>
          </label>
        </div>
      </div>

      {/* Savings Summary Banner */}
      {maxSavings > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#191725] to-[#262143] dark:from-[#15141E] dark:to-[#21202D] border border-[#6750D8]/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6750D8]/20 text-[#B5A5FF] border border-[#6750D8]/40 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#B5A5FF] font-bold">
                Cost Difference Insight
              </p>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lowestFeeOption.name} is currently estimated as lowest fee for this transaction
              </h2>
            </div>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <span className="text-xs text-[#B5B2C4] block">Potential fee savings:</span>
            <span className="text-2xl font-black text-[#B5A5FF] font-mono">
              up to {formatCurrency(maxSavings, currencyCode, paypalResult.currencySymbol)}
            </span>
          </div>
        </div>
      )}

      {/* 3 Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PayPal Card */}
        <div
          className={`bg-white dark:bg-[#191923] rounded-2xl border p-6 flex flex-col justify-between transition-all ${
            lowestFeeOption.id === 'paypal'
              ? 'border-[#6750D8] ring-2 ring-[#6750D8]/25 shadow-card'
              : 'border-[#E9E7EF] dark:border-[#333242] shadow-soft'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#191725] dark:text-[#F7F6FC] text-lg">PayPal</span>
              </div>
              {lowestFeeOption.id === 'paypal' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Lowest Fee
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1">
              <span className="text-xs text-[#686778] dark:text-[#B5B2C4] block">
                {mode === 'standard' ? 'Estimated Net Received' : 'Required Invoice Gross'}
              </span>
              <p className="text-3xl font-black text-[#191725] dark:text-[#F7F6FC] font-mono">
                {mode === 'standard'
                  ? formatCurrency(paypalResult.netAmount, currencyCode, paypalResult.currencySymbol)
                  : formatCurrency(paypalResult.grossAmount, currencyCode, paypalResult.currencySymbol)}
              </p>
              <p className="text-xs text-[#686778] dark:text-[#B5B2C4] pt-1">
                Total Fees: <span className="font-mono font-bold text-rose-500">-{formatCurrency(paypalResult.totalFee, currencyCode, paypalResult.currencySymbol)}</span> ({paypalResult.effectiveFeePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#686778] dark:text-[#B5B2C4] pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
              <div className="flex justify-between">
                <span>Base Invoicing Rate:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {(paypalResult.breakdown.basePercentRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fixed Transaction Fee:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {formatCurrency(paypalResult.breakdown.fixedFee, currencyCode, paypalResult.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cross-Border Surcharge:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {isCrossBorder ? `+${(paypalResult.breakdown.crossBorderRate || 0) * 100}%` : '0.00%'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('paypal')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] hover:bg-[#6750D8] hover:text-white dark:hover:bg-[#B5A5FF] dark:hover:text-[#11111A] text-[#6750D8] dark:text-[#B5A5FF] text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span>Full PayPal Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Payoneer Card */}
        <div
          className={`bg-white dark:bg-[#191923] rounded-2xl border p-6 flex flex-col justify-between transition-all ${
            lowestFeeOption.id === 'payoneer'
              ? 'border-[#E96DAF] ring-2 ring-[#E96DAF]/25 shadow-card'
              : 'border-[#E9E7EF] dark:border-[#333242] shadow-soft'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FDF0F7] dark:bg-[#3D1E30] text-[#E96DAF] dark:text-[#F29BCB] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#191725] dark:text-[#F7F6FC] text-lg">Payoneer</span>
              </div>
              {lowestFeeOption.id === 'payoneer' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Lowest Fee
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1">
              <span className="text-xs text-[#686778] dark:text-[#B5B2C4] block">
                {mode === 'standard' ? 'Estimated Net Received' : 'Required Invoice Gross'}
              </span>
              <p className="text-3xl font-black text-[#191725] dark:text-[#F7F6FC] font-mono">
                {mode === 'standard'
                  ? formatCurrency(payoneerResult.netAmount, currencyCode, payoneerResult.currencySymbol)
                  : formatCurrency(payoneerResult.grossAmount, currencyCode, payoneerResult.currencySymbol)}
              </p>
              <p className="text-xs text-[#686778] dark:text-[#B5B2C4] pt-1">
                Total Fees: <span className="font-mono font-bold text-rose-500">-{formatCurrency(payoneerResult.totalFee, currencyCode, payoneerResult.currencySymbol)}</span> ({payoneerResult.effectiveFeePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#686778] dark:text-[#B5B2C4] pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
              <div className="flex justify-between">
                <span>Card Receiving Rate:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">3.00%</span>
              </div>
              <div className="flex justify-between">
                <span>Fixed Transaction Fee:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Bank FX Withdrawal Spread:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {hasFxSpread ? 'up to 2.00%' : '$1.50 same-cur'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('payoneer')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-[#FDF0F7] dark:bg-[#3D1E30] hover:bg-[#E96DAF] hover:text-white dark:hover:bg-[#F29BCB] dark:hover:text-[#11111A] text-[#E96DAF] dark:text-[#F29BCB] text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span>Full Payoneer Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stripe Card */}
        <div
          className={`bg-white dark:bg-[#191923] rounded-2xl border p-6 flex flex-col justify-between transition-all ${
            lowestFeeOption.id === 'stripe'
              ? 'border-[#6750D8] ring-2 ring-[#6750D8]/25 shadow-card'
              : 'border-[#E9E7EF] dark:border-[#333242] shadow-soft'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#191725] dark:text-[#F7F6FC] text-lg">Stripe</span>
              </div>
              {lowestFeeOption.id === 'stripe' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Lowest Fee
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15141E] border border-[#E9E7EF] dark:border-[#333242] space-y-1">
              <span className="text-xs text-[#686778] dark:text-[#B5B2C4] block">
                {mode === 'standard' ? 'Estimated Net Received' : 'Required Invoice Gross'}
              </span>
              <p className="text-3xl font-black text-[#191725] dark:text-[#F7F6FC] font-mono">
                {mode === 'standard'
                  ? formatCurrency(stripeResult.netAmount, currencyCode, stripeResult.currencySymbol)
                  : formatCurrency(stripeResult.grossAmount, currencyCode, stripeResult.currencySymbol)}
              </p>
              <p className="text-xs text-[#686778] dark:text-[#B5B2C4] pt-1">
                Total Fees: <span className="font-mono font-bold text-rose-500">-{formatCurrency(stripeResult.totalFee, currencyCode, stripeResult.currencySymbol)}</span> ({stripeResult.effectiveFeePercent.toFixed(2)}%)
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#686778] dark:text-[#B5B2C4] pt-2 border-t border-[#E9E7EF] dark:border-[#333242]">
              <div className="flex justify-between">
                <span>Base Card Processing:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {(stripeResult.breakdown.basePercentRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fixed Transaction Fee:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {formatCurrency(stripeResult.breakdown.fixedFee, currencyCode, stripeResult.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>International Card Surcharge:</span>
                <span className="font-mono font-semibold text-[#191725] dark:text-[#F7F6FC]">
                  {isCrossBorder ? `+${(stripeResult.breakdown.crossBorderRate || 0) * 100}%` : '0.00%'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('stripe')}
            className="mt-6 w-full py-2.5 px-3 rounded-xl bg-[#F0EDFD] dark:bg-[#262143] hover:bg-[#6750D8] hover:text-white dark:hover:bg-[#B5A5FF] dark:hover:text-[#11111A] text-[#6750D8] dark:text-[#B5A5FF] text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span>Full Stripe Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-side Full Matrix */}
      <section className="bg-white dark:bg-[#191923] rounded-2xl border border-[#E9E7EF] dark:border-[#333242] p-6 sm:p-8 space-y-4 shadow-soft transition-colors">
        <h2 className="text-xl font-extrabold text-[#191725] dark:text-[#F7F6FC] tracking-tight">
          Comprehensive Feature & Fee Comparison Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9FC] dark:bg-[#15141E] text-[#191725] dark:text-[#F7F6FC] border-y border-[#E9E7EF] dark:border-[#333242] font-semibold">
                <th className="p-3">Feature / Parameter</th>
                <th className="p-3">PayPal</th>
                <th className="p-3">Payoneer</th>
                <th className="p-3">Stripe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E7EF] dark:divide-[#333242] text-[#686778] dark:text-[#B5B2C4]">
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">US Domestic Card Rate</td>
                <td className="p-3">2.99% - 3.49% + $0.49</td>
                <td className="p-3">3.00% (Card) / 1.00% (ACH)</td>
                <td className="p-3 font-semibold text-[#6750D8] dark:text-[#B5A5FF]">2.90% + $0.30</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">International Card Surcharge</td>
                <td className="p-3">+1.50%</td>
                <td className="p-3 font-semibold text-[#E96DAF]">Flat 3.00% (All Card Origins)</td>
                <td className="p-3">+1.50%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">Fixed Fee per Transaction</td>
                <td className="p-3">$0.49 USD</td>
                <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">$0.00 (No fixed card fee)</td>
                <td className="p-3">$0.30 USD</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">Currency Conversion Spread</td>
                <td className="p-3">3.00% to 4.00%</td>
                <td className="p-3">Up to 2.00%</td>
                <td className="p-3">1.00% to 2.00%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">Local Bank Receiving Accounts</td>
                <td className="p-3">No (standard PayPal wallet)</td>
                <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Yes (USD, EUR, GBP accounts)</td>
                <td className="p-3">Requires customer Stripe account</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-[#191725] dark:text-[#F7F6FC]">Account Maintenance / Annual Fee</td>
                <td className="p-3">Free</td>
                <td className="p-3">$29.95/yr if under $2,000 received</td>
                <td className="p-3">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Which one should you choose? Guide */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] space-y-2.5 shadow-soft transition-colors">
          <h3 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center text-xs font-bold">P</span>
            <span>When to choose PayPal</span>
          </h3>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            Choose PayPal when selling to individual consumers who prefer familiar 1-click PayPal balances, or when the client insists on PayPal buyer protection.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] space-y-2.5 shadow-soft transition-colors">
          <h3 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#FDF0F7] dark:bg-[#3D1E30] text-[#E96DAF] dark:text-[#F29BCB] flex items-center justify-center text-xs font-bold">P</span>
            <span>When to choose Payoneer</span>
          </h3>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            Choose Payoneer if you are a remote contractor or agency outside the US/EU receiving payments from US corporate clients via ACH or freelance marketplaces (Upwork, Fiverr).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#191923] border border-[#E9E7EF] dark:border-[#333242] space-y-2.5 shadow-soft transition-colors">
          <h3 className="font-bold text-[#191725] dark:text-[#F7F6FC] text-sm flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#F0EDFD] dark:bg-[#262143] text-[#6750D8] dark:text-[#B5A5FF] flex items-center justify-center text-xs font-bold">S</span>
            <span>When to choose Stripe</span>
          </h3>
          <p className="text-xs text-[#686778] dark:text-[#B5B2C4] leading-relaxed">
            Choose Stripe if you run a modern SaaS business, digital service, or e-commerce checkout where you want seamless embedded credit card processing with transparent developer APIs.
          </p>
        </div>
      </section>
    </div>
  );
};
