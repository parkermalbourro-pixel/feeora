import React from 'react';

interface FeeoraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  monochrome?: boolean;
}

export const FeeoraLogo: React.FC<FeeoraLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  monochrome = false,
}) => {
  // Dimension mappings for the mark
  const sizeMap = {
    xs: { icon: 22, text: 'text-sm', tag: 'text-[9px]' },
    sm: { icon: 28, text: 'text-base', tag: 'text-[10px]' },
    md: { icon: 34, text: 'text-lg', tag: 'text-[11px]' },
    lg: { icon: 44, text: 'text-2xl', tag: 'text-xs' },
    xl: { icon: 56, text: 'text-3xl', tag: 'text-sm' },
  };

  const { icon, text, tag } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Custom Geometric Folded-Ribbon "F" Symbol */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 select-none transition-transform duration-200"
        aria-label="Feeora Symbol"
      >
        <defs>
          <linearGradient id="feeora-top-ribbon" x1="18" y1="14" x2="90" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7B5BFF" />
            <stop offset="100%" stopColor="#6750D8" />
          </linearGradient>
          <linearGradient id="feeora-bottom-stem" x1="18" y1="36" x2="68" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#553EC6" />
            <stop offset="100%" stopColor="#442BB5" />
          </linearGradient>
        </defs>

        {/* Top curved ribbon arm */}
        <path
          d="M18 48C18 25 30 14 50 14H84C89 14 92 18.5 89 23C86.5 27.5 81 30.5 74 30.5H37L18 48Z"
          fill={monochrome ? 'currentColor' : 'url(#feeora-top-ribbon)'}
        />

        {/* Lower stem & middle crossbar with folded crease & angled bottom cut */}
        <path
          d="M18 48L35.5 32H64C69.5 32 73.5 36 73.5 41.5C73.5 47 69.5 51 64 51H34V72L18 86V48Z"
          fill={monochrome ? 'currentColor' : 'url(#feeora-bottom-stem)'}
        />
      </svg>

      {/* Wordmark and Optional Tagline */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight text-[#191725] dark:text-[#F7F6FC] ${text} font-sans`}
            >
              Feeora
            </span>
          </div>
          {showTagline && (
            <span
              className={`text-[#686778] dark:text-[#B5B2C4] font-medium tracking-normal mt-0.5 ${tag}`}
            >
              Know the fee. Keep more of your money.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
