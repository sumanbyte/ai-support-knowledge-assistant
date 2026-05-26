import React from 'react';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'Or' }) => {
  return (
    <div className="relative flex items-center py-2">
      <div className="grow border-t border-outline-variant/10" />
      <span className="mx-4 shrink-0 font-label-sm text-xs uppercase text-on-surface-variant/40">
        {label}
      </span>
      <div className="grow border-t border-outline-variant/10" />
    </div>
  );
};
