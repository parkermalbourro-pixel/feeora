import React from 'react';
import { CalculationMode } from '../types';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ModeSelectorProps {
  mode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="bg-[#FAF9FC] dark:bg-[#11111A] p-1 rounded-xl flex gap-1 border border-[#E9E7EF] dark:border-[#333242] transition-colors">
      <button
        type="button"
        onClick={() => onChange('standard')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold min-h-[38px] transition-all ${
          mode === 'standard'
            ? 'bg-white dark:bg-[#191923] text-[#191725] dark:text-[#F7F6FC] shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
            : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
        }`}
      >
        <ArrowDownRight className={`w-3.5 h-3.5 ${mode === 'standard' ? 'text-[#6750D8] dark:text-[#B5A5FF]' : 'text-[#9593A5]'}`} />
        <span>Gross &rarr; Net Payout</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('reverse')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold min-h-[38px] transition-all ${
          mode === 'reverse'
            ? 'bg-white dark:bg-[#191923] text-[#191725] dark:text-[#F7F6FC] shadow-sm border border-[#E9E7EF] dark:border-[#333242]'
            : 'text-[#686778] dark:text-[#B5B2C4] hover:text-[#191725] dark:hover:text-[#F7F6FC]'
        }`}
      >
        <ArrowUpRight className={`w-3.5 h-3.5 ${mode === 'reverse' ? 'text-[#E96DAF] dark:text-[#F29BCB]' : 'text-[#9593A5]'}`} />
        <span>Target Net &rarr; Invoice</span>
      </button>
    </div>
  );
};
