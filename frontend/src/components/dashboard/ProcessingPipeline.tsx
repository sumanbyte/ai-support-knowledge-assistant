import React from 'react';
import { PIPELINE_STEPS } from '../../data/mockData';
import { cn } from '../../utils/cn';
import { Icon } from '../UI/Icon';

interface ProcessingPipelineProps {
  onViewAll?: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({ onViewAll }) => {
  return (
    <div className="glass-panel p-7 rounded-xl flex flex-col flex-1">
      <div className="flex justify-between items-center mb-5 border-b border-outline-variant/10 pb-4">
        <h3 className="text-headline-md text-on-surface flex items-center gap-2 font-medium">
          <Icon name="account_tree" className="text-primary" size={20} />
          Processing Pipeline
        </h3>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-primary font-label-sm hover:underline"
          >
            View All
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 py-2">
        {PIPELINE_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'w-full flex items-center gap-5 px-1 py-1',
                step.status === 'pending' && 'opacity-50'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border shrink-0',
                  step.status === 'complete' && 'bg-surface-container-high border-primary/30',
                  step.status === 'active' &&
                    'bg-primary/10 border-primary/50 ai-glow relative',
                  step.status === 'pending' && 'bg-surface-container-high border-outline-variant/30'
                )}
              >
                {step.status === 'active' && (
                  <div className="absolute inset-0 border border-primary rounded-full animate-ping opacity-20" />
                )}
                <Icon
                  name={step.icon}
                  className={cn(
                    step.status === 'active' && 'text-primary animate-pulse',
                    step.status === 'complete' && 'text-primary',
                    step.status === 'pending' && 'text-on-surface-variant'
                  )}
                  size={20}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-on-surface text-sm">{step.label}</span>
                  <span className="font-label-sm text-on-surface-variant">
                    {step.status === 'pending' ? 'Pending' : `${step.progress}%`}
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-1000',
                      step.status === 'pending' ? 'bg-outline-variant/50 w-0' : 'bg-primary'
                    )}
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            </div>
            {index < PIPELINE_STEPS.length - 1 && (
              <div className="w-px h-4 bg-outline-variant/30 ml-5" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
