import toast from 'react-hot-toast';

export default function useToast() {
  const showSuccessToast = (message: string) => toast.success(message);
  const showErrorToast = (message: string) => toast.error(message);
  const showWarningToast = (message: string) => toast(message, { icon: '⚠️' });

  return {
    showSuccessToast,
    showWarningToast,
    showErrorToast,
  };
}
