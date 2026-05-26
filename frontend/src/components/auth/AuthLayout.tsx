import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, footer }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {children}
        {footer}
      </div>
    </div>
  );
};
