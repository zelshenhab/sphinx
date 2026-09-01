interface BrandWordmarkProps {
  light?: boolean;
  compact?: boolean;
  className?: string;
}

export function BrandWordmark({ light = false, compact = false, className = '' }: BrandWordmarkProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div
        className={`display leading-none tracking-[.2em] [text-indent:.2em] ${
          compact ? 'text-3xl md:text-4xl' : 'text-5xl md:text-7xl lg:text-8xl'
        } ${light ? 'text-white' : 'text-ink'}`}
      >
        SPHINX
      </div>
      <div className={`my-4 h-px ${compact ? 'w-20' : 'w-28 md:w-36'} ${light ? 'bg-gold' : 'bg-brown'}`} />
      <div
        className={`uppercase tracking-[.5em] [text-indent:.5em] ${compact ? 'text-[8px]' : 'text-[9px] md:text-[11px]'} ${
          light ? 'text-gold' : 'text-brown'
        }`}
      >
        THE GUARDIAN
      </div>
    </div>
  );
}
