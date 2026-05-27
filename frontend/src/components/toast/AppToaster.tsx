import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      gap={10}
      visibleToasts={4}
      richColors
      closeButton
      toastOptions={{
        duration: 4500,
        classNames: {
          toast:
            'glass-panel !rounded-lg !border-outline-variant/20 !shadow-none !py-2.5 !px-3 !min-h-0 !w-[min(100vw-2rem,340px)]',
          title: '!text-[13px] !font-medium !leading-snug !text-on-surface',
          description: '!text-xs !leading-snug !text-on-surface-variant',
          closeButton:
            '!left-auto !right-2 !top-2 !border-0 !bg-transparent !text-on-surface-variant hover:!text-on-surface !size-6',
          icon: '!size-4',
        },
      }}
    />
  );
}
