import React from 'react';

export const Logo: React.FC<{ className?: string; showText?: boolean }> = ({
  className = "h-10",
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Brand Logo Icon */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square drop-shadow-sm"
      >
        {/* Outer Shield Path in Primary Emerald Green */}
        <path
          d="M50 5L15 20V45C15 68 30 88 50 95C70 88 85 68 85 45V20L50 5Z"
          fill="#003C35"
          stroke="#C9A04A"
          strokeWidth="3"
        />
        {/* Inner Security Emblem / Covenant Cross & Guard Crest in Royal Gold */}
        <path
          d="M50 22V78M28 42H72M38 32L62 62M62 32L38 62"
          stroke="#C9A04A"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="12" fill="#092824" stroke="#C9A04A" strokeWidth="2" />
        <path
          d="M50 42L54 48H46L50 42Z"
          fill="#C9A04A"
        />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-wider text-emerald-900 text-lg uppercase font-serif">
            Covenant Shield
          </span>
          <span className="text-[10px] tracking-widest text-gold-500 uppercase font-semibold">
            Security Services
          </span>
        </div>
      )}
    </div>
  );
};
