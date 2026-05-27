import { toast as sonnerToast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

function emit(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  options?: ToastOptions,
) {
  const duration = options?.duration;
  if (options?.title) {
    return sonnerToast[type](options.title, { description: message, duration });
  }
  return sonnerToast[type](message, { description: options?.description, duration });
}

export const toast = {
  success: (message: string, options?: ToastOptions) => emit('success', message, options),
  error: (message: string, options?: ToastOptions) => emit('error', message, options),
  warning: (message: string, options?: ToastOptions) => emit('warning', message, options),
  info: (message: string, options?: ToastOptions) => emit('info', message, options),
  dismiss: sonnerToast.dismiss,
};
