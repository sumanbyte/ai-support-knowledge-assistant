import { useEffect } from "react";
import { toast } from "sonner";


export const useLoading = (loading: boolean, message?: string) => {
    useEffect(() => {
        if (!loading) return;
        const toastId = toast.loading(message || 'Loading...');
        return () => {
            toast.dismiss(toastId);
        }
    }, [loading, message]);
}