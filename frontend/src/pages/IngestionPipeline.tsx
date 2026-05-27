import React from 'react';
import { AppShell } from '../components/Layout';
import { PageHeader } from '../components/Layout/PageHeader';
import { PageContent } from '../components/Layout/PageContent';
import { Icon } from '../components/UI/Icon';
const ACTIVE_TASKS = [
  {
    id: '1',
    name: 'Q3_Financial_Analysis_FY24.pdf',
    size: '4.2 MB',
    icon: 'picture_as_pdf',
    progress: 65,
    stage: 2,
    log: '> Generating vector representations using model: text-embedding-3-large',
  },
  {
    id: '2',
    name: 'Employee_Handbook_2024.docx',
    size: '1.8 MB',
    icon: 'description',
    progress: 30,
    stage: 1,
    log: '> Applying semantic chunking strategies. Current chunks: 428',
  },
];

const STAGES = ['EXTRACTION', 'CHUNKING', 'EMBEDDING', 'STORAGE'];

export const IngestionPipeline: React.FC = () => {
  return (
    <AppShell
      header={
        <PageHeader
          title="Ingestion Pipeline"
          subtitle="Files are automatically processed through the RAG pipeline after upload."
        />
      }
    >
      <PageContent className="space-y-10">
        <div className="glass-panel rounded-xl border-2 border-dashed border-outline-variant/30 p-12 text-center hover:border-primary/30 transition-colors cursor-pointer">
          <Icon name="cloud_upload" size={48} className="text-primary mx-auto mb-4" />
          <p className="text-on-surface font-semibold text-lg">Drag & Drop Documents</p>
          <p className="text-on-surface-variant mt-2">
            or browse files (PDF, DOCX, TXT, CSV up to 50MB)
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-on-surface font-medium">Active Tasks</h3>
            <span className="font-label-sm text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
              3 in progress
            </span>
          </div>

          <div className="space-y-4">
            {ACTIVE_TASKS.map((task) => (
              <div key={task.id} className="glass-panel rounded-xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded bg-[#ff3b30]/10 flex items-center justify-center">
                    <Icon name={task.icon} className="text-[#ff3b30]" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface font-medium truncate">{task.name}</p>
                    <p className="text-on-surface-variant text-sm">{task.size}</p>
                  </div>
                  <span className="text-primary text-sm font-medium">
                    Processing… {task.progress}%
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2 px-2">
                  {STAGES.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-[10px] font-mono ${
                            i < task.stage
                              ? 'bg-primary border-primary text-on-primary'
                              : i === task.stage
                                ? 'border-primary text-primary ai-glow-sm'
                                : 'border-outline-variant/40 text-on-surface-variant'
                          }`}
                        >
                          {i < task.stage ? (
                            <Icon name="check" size={14} />
                          ) : (
                            String(i + 1).padStart(2, '0')
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-on-surface-variant hidden sm:block">
                          {stage}
                        </span>
                      </div>
                      {i < STAGES.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 mb-4 ${
                            i < task.stage ? 'bg-primary' : 'bg-outline-variant/30'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <p className="font-mono text-xs text-on-surface-variant bg-[#0a0a0c] px-3 py-2 rounded">
                  {task.log}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
};

export default IngestionPipeline;

