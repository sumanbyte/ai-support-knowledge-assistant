import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="page-header-wrap">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8">
        <div className="min-w-0">
          <h2 className="font-display text-headline-lg font-semibold text-on-surface mb-2">{title}</h2>
          {subtitle && (
            <p className="text-on-surface-variant text-body-md max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
