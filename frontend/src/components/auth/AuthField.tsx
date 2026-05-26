import React from 'react';
import { Icon } from '../UI/Icon';

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  labelExtra?: React.ReactNode;
  inputClassName?: string;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  icon,
  value,
  onChange,
  required,
  labelExtra,
  inputClassName = 'bg-surface-container-low',
}) => {
  return (
    <div className="flex flex-col gap-1">
      {labelExtra ?? (
        <label
          htmlFor={id}
          className="ml-1 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant"
        >
          {label}
        </label>
      )}
      <div className="group relative">
        <Icon
          name={icon}
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary"
        />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-outline-variant/30 py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 ${inputClassName}`}
        />
      </div>
    </div>
  );
};
