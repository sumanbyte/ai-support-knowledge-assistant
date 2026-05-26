import { cn } from '../../utils/cn';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export function Icon({ name, className, filled = false, size = 20 }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined leading-none', className)}
      style={{
        fontSize: size,
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

