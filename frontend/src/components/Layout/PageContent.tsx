import React from 'react';
import { cn } from '../../utils/cn';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContent: React.FC<PageContentProps> = ({ children, className }) => {
  return <div className={cn('page-content', className)}>{children}</div>;
};
