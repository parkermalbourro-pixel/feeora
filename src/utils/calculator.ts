import {
  CalculationMode,
  CalculationResult,
  FeeRuleAssumption,
} from '../types';
import {
  SUPPORTED_CURRENCIES,
  PAYPAL_FEE_ASSUMPTIONS,
  PAYONEER_FEE_ASSUMPTIONS,
  STRIPE_FEE_ASSUMPTIONS,
} from '../data/feeRules';

export function getCurrencyConfig(code: string) {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
}

export function formatCurrency(amount: number, currencyCode: string = 'USD', symbol: string = '$'): string {
  if (isNaN(amount) || !isFinite(amount)) return `${symbol}0.00`;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted} ${currencyCode}`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

// PayPal Calculation
export interface PayPalCalcParams {
  amount: number;
  mode: CalculationMode;
  regionCode: string;
  currencyCode: string;
  transactionType: 'invoicing' | 'checkout' | 'qr_code';
  isInternational: boolean;
  hasCurrencyConversion: boolean;
}

export function calculatePayPal(params: PayPalCalcParams): CalculationResult {
  const { amount, mode, regionCode, currencyCode, transactionType, isInternational, hasCurrencyConversion } = params;
  const currency = getCurrencyConfig(currencyCode);
  const fixedFee = currency.fixedFee.paypal;
  
  let baseRate = 0.0299; // 2.99% for US invoicing
  if (regionCode === 'US') {
    if (transactionType === 'invoicing') baseRate = 0.0299;
    else if (transactionType === 'checkout') baseRate = 0.0349;
    else if (transactionType === 'qr_code') baseRate = 0.019;
  } else if (regionCode === 'GB') {
    baseRate = 0.029;
  } else if (regionCode === 'EU') {
    baseRate = 0.029;
  } else {
    baseRate = 0.044; // International ROW
  }

  const crossBorderRate = isInternational ? (regionCode === 'GB' || regionCode === 'EU' ? 0.0199 : 0.015) : 0;
  const conversionRate = hasCurrencyConversion ? 0.035 : 0; // 3.50% standard conversion spread
  const totalPercentRate = baseRate + crossBorderRate + conversionRate;

  const assumption = PAYPAL_FEE_ASSUMPTIONS[regionCode] || PAYPAL_FEE_ASSUMPTIONS['ROW'];

  if (mode === 'standard') {
    const gross = Math.max(0, amount);
    const baseFee = Math.round(gross * baseRate * 100) / 100;
    const crossBorderFee = Math.round(gross * crossBorderRate * 100) / 100;
    const conversionFee = Math.round(gross * conversionRate * 100) / 100;
    const totalFee = Math.round((baseFee + fixedFee + crossBorderFee + conversionFee) * 100) / 100;
    const net = Math.max(0, Math.round((gross - totalFee) * 100) / 100);
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Standard Calculation:
Gross Payment: ${currency.symbol}${gross.toFixed(2)}
1. Base Percentage Fee: ${gross.toFixed(2)} × ${formatPercent(baseRate)} = ${currency.symbol}${baseFee.toFixed(2)}
2. Fixed Transaction Fee: ${currency.symbol}${fixedFee.toFixed(2)}
${isInternational ? `3. Cross-Border Surcharge: ${gross.toFixed(2)} × ${formatPercent(crossBorderRate)} = ${currency.symbol}${crossBorderFee.toFixed(2)}\n` : ''}${hasCurrencyConversion ? `4. Currency Conversion Spread: ${gross.toFixed(2)} × ${formatPercent(conversionRate)} = ${currency.symbol}${conversionFee.toFixed(2)}\n` : ''}Total Estimated Fees: ${currency.symbol}${totalFee.toFixed(2)}
Net Received Amount: ${currency.symbol}${net.toFixed(2)}`;

    return {
      mode: 'standard',
      grossAmount: gross,
      netAmount: net,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: baseFee,
        basePercentRate: baseRate,
        fixedFee,
        crossBorderFee: isInternational ? crossBorderFee : 0,
        crossBorderRate,
        currencyConversionFee: hasCurrencyConversion ? conversionFee : 0,
        currencyConversionRate: conversionRate,
      },
      provider: 'paypal',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: assumption,
      formulaExplanation,
    };
  } else {
    // Reverse calculation (Target Net -> Gross Invoice Amount)
    const targetNet = Math.max(0, amount);
    // Net = Gross * (1 - totalPercentRate) - fixedFee
    // Gross = (Net + fixedFee) / (1 - totalPercentRate)
    const denominator = 1 - totalPercentRate;
    const gross = denominator > 0 ? Math.round(((targetNet + fixedFee) / denominator) * 100) / 100 : 0;
    const baseFee = Math.round(gross * baseRate * 100) / 100;
    const crossBorderFee = Math.round(gross * crossBorderRate * 100) / 100;
    const conversionFee = Math.round(gross * conversionRate * 100) / 100;
    const totalFee = Math.round((gross - targetNet) * 100) / 100;
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Reverse (Gross-Up) Calculation:
Target Net Desired: ${currency.symbol}${targetNet.toFixed(2)}
Formula: Gross = (Target Net + Fixed Fee) ÷ (1 - Total Percentage Rate)
Total Rate = ${formatPercent(baseRate)}${isInternational ? ` + ${formatPercent(crossBorderRate)} (Cross-border)` : ''}${hasCurrencyConversion ? ` + ${formatPercent(conversionRate)} (FX spread)` : ''} = ${formatPercent(totalPercentRate)}
Calculation: (${targetNet.toFixed(2)} + ${fixedFee.toFixed(2)}) ÷ (1 - ${(totalPercentRate).toFixed(4)})
Gross to Invoice: ${currency.symbol}${gross.toFixed(2)}
Total Deducted Fees: ${currency.symbol}${totalFee.toFixed(2)}`;

    return {
      mode: 'reverse',
      grossAmount: gross,
      netAmount: targetNet,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: baseFee,
        basePercentRate: baseRate,
        fixedFee,
        crossBorderFee: isInternational ? crossBorderFee : 0,
        crossBorderRate,
        currencyConversionFee: hasCurrencyConversion ? conversionFee : 0,
        currencyConversionRate: conversionRate,
      },
      provider: 'paypal',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: assumption,
      formulaExplanation,
    };
  }
}

// Payoneer Calculation
export interface PayoneerCalcParams {
  amount: number;
  mode: CalculationMode;
  currencyCode: string;
  receivingMethod: 'credit_card' | 'ach_debit' | 'receiving_accounts' | 'payoneer_to_payoneer';
  withdrawalMethod: 'none' | 'bank_fx' | 'bank_same_currency';
}

export function calculatePayoneer(params: PayoneerCalcParams): CalculationResult {
  const { amount, mode, currencyCode, receivingMethod, withdrawalMethod } = params;
  const currency = getCurrencyConfig(currencyCode);

  let receivingRate = 0.03; // Credit Card = 3.00%
  if (receivingMethod === 'credit_card') receivingRate = 0.03;
  else if (receivingMethod === 'ach_debit') receivingRate = 0.01;
  else if (receivingMethod === 'receiving_accounts') receivingRate = 0.00; // Typically 0% for USD/EUR/GBP receiving accounts
  else if (receivingMethod === 'payoneer_to_payoneer') receivingRate = 0.00; // Free

  let withdrawalRate = 0;
  let withdrawalFixed = 0;
  if (withdrawalMethod === 'bank_fx') {
    withdrawalRate = 0.02; // Up to 2% FX conversion spread
  } else if (withdrawalMethod === 'bank_same_currency') {
    withdrawalFixed = currency.fixedFee.payoneerFixedWithdrawal;
  }

  const totalPercentRate = receivingRate + withdrawalRate;

  if (mode === 'standard') {
    const gross = Math.max(0, amount);
    const receivingFee = Math.round(gross * receivingRate * 100) / 100;
    const amountAfterReceiving = gross - receivingFee;
    const withdrawalPercentFee = Math.round(amountAfterReceiving * withdrawalRate * 100) / 100;
    const totalWithdrawalFee = withdrawalPercentFee + withdrawalFixed;
    const totalFee = Math.round((receivingFee + totalWithdrawalFee) * 100) / 100;
    const net = Math.max(0, Math.round((gross - totalFee) * 100) / 100);
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Payoneer Standard Calculation:
Gross Payment: ${currency.symbol}${gross.toFixed(2)}
1. Receiving Fee (${formatPercent(receivingRate)}): ${currency.symbol}${receivingFee.toFixed(2)}
${withdrawalMethod !== 'none' ? `2. Local Bank Withdrawal Fee: ${withdrawalFixed > 0 ? `${currency.symbol}${withdrawalFixed.toFixed(2)} fixed` : `${formatPercent(withdrawalRate)} FX conversion (${currency.symbol}${withdrawalPercentFee.toFixed(2)})`}\n` : ''}Total Estimated Fees: ${currency.symbol}${totalFee.toFixed(2)}
Estimated Net Payout: ${currency.symbol}${net.toFixed(2)}`;

    return {
      mode: 'standard',
      grossAmount: gross,
      netAmount: net,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: receivingFee,
        basePercentRate: receivingRate,
        fixedFee: 0,
        withdrawalFee: totalWithdrawalFee,
        currencyConversionFee: withdrawalPercentFee,
        currencyConversionRate: withdrawalRate,
      },
      provider: 'payoneer',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: PAYONEER_FEE_ASSUMPTIONS,
      formulaExplanation,
    };
  } else {
    // Reverse calculation
    const targetNet = Math.max(0, amount);
    // Net = [Gross * (1 - receivingRate)] * (1 - withdrawalRate) - withdrawalFixed
    // Net + withdrawalFixed = Gross * (1 - receivingRate) * (1 - withdrawalRate)
    const combinedMultiplier = (1 - receivingRate) * (1 - withdrawalRate);
    const gross = combinedMultiplier > 0 ? Math.round(((targetNet + withdrawalFixed) / combinedMultiplier) * 100) / 100 : 0;
    const totalFee = Math.round((gross - targetNet) * 100) / 100;
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Payoneer Reverse (Gross-Up) Calculation:
Target Net Desired: ${currency.symbol}${targetNet.toFixed(2)}
Receiving Fee Rate: ${formatPercent(receivingRate)}
Withdrawal Fee: ${withdrawalFixed > 0 ? `${currency.symbol}${withdrawalFixed.toFixed(2)} flat` : `${formatPercent(withdrawalRate)} FX conversion`}
Required Gross to Invoice: ${currency.symbol}${gross.toFixed(2)}
Total Deductions: ${currency.symbol}${totalFee.toFixed(2)}`;

    return {
      mode: 'reverse',
      grossAmount: gross,
      netAmount: targetNet,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: Math.round(gross * receivingRate * 100) / 100,
        basePercentRate: receivingRate,
        fixedFee: 0,
        withdrawalFee: withdrawalFixed,
        currencyConversionRate: withdrawalRate,
      },
      provider: 'payoneer',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: PAYONEER_FEE_ASSUMPTIONS,
      formulaExplanation,
    };
  }
}

// Stripe Calculation
export interface StripeCalcParams {
  amount: number;
  mode: CalculationMode;
  regionCode: string;
  currencyCode: string;
  isInternationalCard: boolean;
  hasCurrencyConversion: boolean;
  isInvoicingPlus: boolean;
}

export function calculateStripe(params: StripeCalcParams): CalculationResult {
  const { amount, mode, regionCode, currencyCode, isInternationalCard, hasCurrencyConversion, isInvoicingPlus } = params;
  const currency = getCurrencyConfig(currencyCode);
  const fixedFee = currency.fixedFee.stripe;

  let baseRate = 0.029; // 2.9% standard US
  let internationalSurcharge = 0.015; // 1.5% US international card
  let conversionSurcharge = 0.01; // 1.0% US currency conversion

  if (regionCode === 'GB') {
    baseRate = 0.015; // 1.5% UK domestic
    internationalSurcharge = 0.0175; // +1.75% for non-UK international (making 3.25%)
    conversionSurcharge = 0.02; // 2.0%
  } else if (regionCode === 'EU') {
    baseRate = 0.015; // 1.5% EEA domestic
    internationalSurcharge = 0.0175; // +1.75% non-EEA
    conversionSurcharge = 0.02; // 2.0%
  } else if (regionCode === 'ROW') {
    baseRate = 0.034;
    internationalSurcharge = 0.01;
    conversionSurcharge = 0.015;
  }

  const invoicingFeeRate = isInvoicingPlus ? 0.004 : 0; // 0.4% for Invoicing Plus
  const appliedInternationalRate = isInternationalCard ? internationalSurcharge : 0;
  const appliedConversionRate = hasCurrencyConversion ? conversionSurcharge : 0;
  const totalPercentRate = baseRate + appliedInternationalRate + appliedConversionRate + invoicingFeeRate;

  const assumption = STRIPE_FEE_ASSUMPTIONS[regionCode] || STRIPE_FEE_ASSUMPTIONS['ROW'];

  if (mode === 'standard') {
    const gross = Math.max(0, amount);
    const baseFee = Math.round(gross * baseRate * 100) / 100;
    const internationalFee = Math.round(gross * appliedInternationalRate * 100) / 100;
    const conversionFee = Math.round(gross * appliedConversionRate * 100) / 100;
    const invoicingFee = Math.round(gross * invoicingFeeRate * 100) / 100;
    const totalFee = Math.round((baseFee + fixedFee + internationalFee + conversionFee + invoicingFee) * 100) / 100;
    const net = Math.max(0, Math.round((gross - totalFee) * 100) / 100);
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Stripe Standard Calculation:
Gross Payment: ${currency.symbol}${gross.toFixed(2)}
1. Base Card Processing Fee: ${gross.toFixed(2)} × ${formatPercent(baseRate)} = ${currency.symbol}${baseFee.toFixed(2)}
2. Fixed Fee: ${currency.symbol}${fixedFee.toFixed(2)}
${isInternationalCard ? `3. International Card Fee: ${gross.toFixed(2)} × ${formatPercent(appliedInternationalRate)} = ${currency.symbol}${internationalFee.toFixed(2)}\n` : ''}${hasCurrencyConversion ? `4. Currency Conversion Fee: ${gross.toFixed(2)} × ${formatPercent(appliedConversionRate)} = ${currency.symbol}${conversionFee.toFixed(2)}\n` : ''}${isInvoicingPlus ? `5. Invoicing Plus (+0.4%): ${currency.symbol}${invoicingFee.toFixed(2)}\n` : ''}Total Estimated Fees: ${currency.symbol}${totalFee.toFixed(2)}
Estimated Net Payout: ${currency.symbol}${net.toFixed(2)}`;

    return {
      mode: 'standard',
      grossAmount: gross,
      netAmount: net,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: baseFee,
        basePercentRate: baseRate,
        fixedFee,
        crossBorderFee: isInternationalCard ? internationalFee : 0,
        crossBorderRate: appliedInternationalRate,
        currencyConversionFee: hasCurrencyConversion ? conversionFee : 0,
        currencyConversionRate: appliedConversionRate,
        otherFees: isInvoicingPlus ? invoicingFee : 0,
      },
      provider: 'stripe',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: assumption,
      formulaExplanation,
    };
  } else {
    // Reverse calculation
    const targetNet = Math.max(0, amount);
    // Net = Gross * (1 - totalPercentRate) - fixedFee
    // Gross = (Net + fixedFee) / (1 - totalPercentRate)
    const denominator = 1 - totalPercentRate;
    const gross = denominator > 0 ? Math.round(((targetNet + fixedFee) / denominator) * 100) / 100 : 0;
    const baseFee = Math.round(gross * baseRate * 100) / 100;
    const internationalFee = Math.round(gross * appliedInternationalRate * 100) / 100;
    const conversionFee = Math.round(gross * appliedConversionRate * 100) / 100;
    const totalFee = Math.round((gross - targetNet) * 100) / 100;
    const effectiveFeePercent = gross > 0 ? (totalFee / gross) * 100 : 0;

    const formulaExplanation = `Stripe Reverse (Gross-Up) Calculation:
Target Net Desired: ${currency.symbol}${targetNet.toFixed(2)}
Formula: Gross = (Target Net + Fixed Fee) ÷ (1 - Total Percentage Rate)
Total Rate = ${formatPercent(baseRate)}${isInternationalCard ? ` + ${formatPercent(appliedInternationalRate)} (International card)` : ''}${hasCurrencyConversion ? ` + ${formatPercent(appliedConversionRate)} (Currency conversion)` : ''}${isInvoicingPlus ? ` + 0.40% (Invoicing Plus)` : ''} = ${formatPercent(totalPercentRate)}
Fixed Fee: ${currency.symbol}${fixedFee.toFixed(2)}
Gross to Invoice: ${currency.symbol}${gross.toFixed(2)}
Total Deducted Fees: ${currency.symbol}${totalFee.toFixed(2)}`;

    return {
      mode: 'reverse',
      grossAmount: gross,
      netAmount: targetNet,
      totalFee,
      effectiveFeePercent,
      breakdown: {
        basePercentFee: baseFee,
        basePercentRate: baseRate,
        fixedFee,
        crossBorderFee: isInternationalCard ? internationalFee : 0,
        crossBorderRate: appliedInternationalRate,
        currencyConversionFee: hasCurrencyConversion ? conversionFee : 0,
        currencyConversionRate: appliedConversionRate,
      },
      provider: 'stripe',
      currencySymbol: currency.symbol,
      currencyCode: currency.code,
      assumptions: assumption,
      formulaExplanation,
    };
  }
}
