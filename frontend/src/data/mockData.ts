import type { DocumentDto } from "../api";

export const RECENT_CHATS = [
  {
    id: '1',
    title: 'Q3 Revenue Analysis',
    preview: 'Can you summarize the main factors contributing to the dip in EMEA region?',
    time: '2m ago',
  },
  {
    id: '2',
    title: 'Onboarding Draft Review',
    preview: 'Review this draft and ensure tone aligns with our style guide.',
    time: '1h ago',
  },
  {
    id: '3',
    title: 'API Error Debugging',
    preview: "I'm getting a 500 error on the /v1/completions endpoint. Here are the logs...",
    time: '3h ago',
  },
];

export const PIPELINE_STEPS = [
  { id: 'ingest', label: 'Ingestion (S3 Bucket)', progress: 100, status: 'complete' as const, icon: 'cloud_download' },
  { id: 'embed', label: 'Embedding Generation', progress: 68, status: 'active' as const, icon: 'model_training' },
  { id: 'index', label: 'Vector Store Indexing', progress: 0, status: 'pending' as const, icon: 'dns' },
];

export const TERMINAL_LOGS = [
  { time: '10:42:01', level: 'INFO', message: 'Starting chunking process for doc_id=8923' },
  { time: '10:42:02', level: 'INFO', message: 'Extracted 42 text chunks. Initiating embedding call.' },
  { time: '10:42:05', level: 'INFO', message: 'Received 42 vectors (dim=1536).' },
  { time: '10:42:05', level: 'WARN', message: 'Slight delay in Pinecone upsert response.' },
  { time: '10:42:08', level: 'SUCCESS', message: "Upserted 42 vectors to namespace 'sales-q3'." },
  { time: '10:42:10', level: 'INFO', message: 'Fetching next batch from queue...' },
  { time: '10:42:11', level: 'INFO', message: 'Processing doc_id=8924 (mime: application/pdf)' },
];

export const RAG_SOURCES = [
  {
    id: '1',
    title: 'Acme_Q4_10K.pdf',
    excerpt:
      '...anticipate will impact Q1 production volumes by approximately 15% due to ongoing constraints in sourcing tier-1 microprocessors from our primary vendor...',
    match: 98,
    page: 'Page 14 • Risk Factors',
    icon: 'picture_as_pdf',
    cited: 1,
    highlight: true,
  },
  {
    id: '2',
    title: 'Q4_Financials_Appendix.xlsx',
    excerpt:
      'Freight and shipping costs have increased by 22% year-over-year, significantly compressing gross margins in the hardware division to 18.2%...',
    match: 85,
    page: 'Sheet: Logistics',
    icon: 'table_chart',
    cited: 2,
    highlight: false,
  },
  {
    id: '3',
    title: 'Supply_Chain_Memo_Nov.docx',
    excerpt:
      'New export restrictions enacted in November have forced a hasty relocation of final assembly from Region A to Region B, introducing short-term operational risks...',
    match: 72,
    page: 'Section 2.1',
    icon: 'description',
    cited: 3,
    highlight: false,
  },
];

export const CHAT_SUGGESTIONS = [
  'Compare Q4 vs Q3 Revenue',
  'List Top Competitors',
  'Draft summary email',
];

export const DEMO_DOCUMENTS = [
  {
    id: '1',
    name: 'Q3_Financial_Report.pdf',
    fullName: 'Q3_Enterprise_Financial_Report_FINAL.pdf',
    size: '2.4 MB',
    dept: 'Finance Dept',
    status: 'INDEXED' as const,
    chunks: 1240,
    synced: '2h ago',
    icon: 'picture_as_pdf',
    iconColor: 'text-[#ff3b30] bg-[#ff3b30]/10 border-[#ff3b30]/20',
  },
  {
    id: '2',
    name: 'Eng_Handbook_2024.docx',
    fullName: 'Engineering_Handbook_2024.docx',
    size: '850 KB',
    dept: 'HR',
    status: 'PROCESSING' as const,
    chunks: 0,
    synced: 'Just now',
    icon: 'description',
    iconColor: 'text-[#007aff] bg-[#007aff]/10 border-[#007aff]/20',
  },
  {
    id: '3',
    name: 'System_Arch_v2.md',
    fullName: 'System_Architecture_v2.md',
    size: '12 KB',
    dept: 'Engineering',
    status: 'INDEXED' as const,
    chunks: 45,
    synced: '1d ago',
    icon: 'markdown',
    iconColor: 'text-on-surface-variant bg-on-surface-variant/10 border-on-surface-variant/20',
  },
  {
    id: '4',
    name: 'Acme_Q4_10K.pdf',
    fullName: 'Acme_Corp_Q4_10K_Filing.pdf',
    size: '4.2 MB',
    dept: 'Legal',
    status: 'INDEXED' as const,
    chunks: 512,
    synced: '3h ago',
    icon: 'picture_as_pdf',
    iconColor: 'text-[#ff3b30] bg-[#ff3b30]/10 border-[#ff3b30]/20',
  },
  {
    id: '5',
    name: 'Sales_Playbook.pptx',
    fullName: 'Enterprise_Sales_Playbook_2026.pptx',
    size: '8.1 MB',
    dept: 'Sales',
    status: 'ERROR' as const,
    chunks: 0,
    synced: '5d ago',
    icon: 'slideshow',
    iconColor: 'text-tertiary bg-tertiary/10 border-tertiary/20',
  },
  {
    id: '6',
    name: 'API_Reference.yaml',
    fullName: 'OpenAPI_v3_Reference.yaml',
    size: '340 KB',
    dept: 'Engineering',
    status: 'INDEXED' as const,
    chunks: 89,
    synced: '12h ago',
    icon: 'code',
    iconColor: 'text-secondary bg-secondary/10 border-secondary/20',
  },
];



export const SEED_CHAT_MESSAGES = [
  //   {
  //     id: 'sep1',
  //     type: 'separator' as const,
  //     label: 'Today, 10:42 AM',
  //   },
  //   {
  //     id: 'u1',
  //     type: 'user' as const,
  //     content:
  //       'Can you summarize the main risk factors mentioned in the Acme Corp Q4 filing? Highlight any supply chain issues.',
  //     timestamp: '',
  //   },
  //   {
  //     id: 'a1',
  //     type: 'ai' as const,
  //     content: `Based on the analyzed Acme Corp Q4 10-K filing, here are the primary risk factors with a focus on the supply chain:

  // • **Microchip Shortages:** The company continues to face severe constraints in sourcing tier-1 microprocessors, which they anticipate will impact Q1 production volumes by approximately 15% [1].

  // • **Logistics Costs:** Freight and shipping costs have increased by 22% year-over-year, significantly compressing gross margins in the hardware division [2].

  // • **Geopolitical Tariffs:** New export restrictions enacted in November have forced a hasty relocation of final assembly from Region A to Region B, introducing short-term operational risks [3].`,
  //     timestamp: '10:43 AM',
  //     citations: [1, 2, 3],
  //   },
  //   {
  //     id: 'u2',
  //     type: 'user' as const,
  //     content: 'How does this compare to their previous quarter?',
  //     timestamp: '',
  //   },
  //   {
  //     id: 'a2',
  //     type: 'ai' as const,
  //     content:
  //       'Comparing Q4 to Q3, the supply chain situation has demonstrably deteriorated. In Q3, Acme Corp reported a 5% impact on production from chip shortages, which has now escalated to 15%. Additionally, freight costs were only up 8% YoY in Q3 compared to the current 22% spike.',
  //     timestamp: '10:44 AM',
  //     isStreaming: true,
  //   },
];
