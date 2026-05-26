import React from 'react';
import { Icon } from '../UI/Icon';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
  accent?: 'primary' | 'secondary' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  badge,
  badgeClass = 'text-tertiary bg-tertiary/10',
  accent = 'primary',
}) => {
  const gradient =
    accent === 'primary'
      ? 'from-primary/5'
      : accent === 'secondary'
        ? 'from-secondary/5'
        : 'from-error/5';

  const iconStyles =
    accent === 'primary'
      ? 'text-primary bg-primary/10'
      : accent === 'secondary'
        ? 'text-secondary bg-secondary/10'
        : 'text-on-surface bg-surface-container-high';

  return (
    <div className="glass-panel p-7 rounded-xl relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <span className={`inline-flex p-2.5 rounded-xl ${iconStyles}`}>
            <Icon name={icon} size={24} />
          </span>
          {badge && (
            <span className={`font-label-sm px-2.5 py-1 rounded-md ${badgeClass}`}>{badge}</span>
          )}
        </div>
        <h3 className="text-on-surface-variant font-medium mb-2 text-sm">{label}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-headline-lg text-on-surface">{value}</span>
          {unit && <span className="text-on-surface-variant/60 text-sm">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
