import { isAxiosError } from "axios";
import { toast } from "../components/toast";
import { useEffect } from "react";


export function useError(error: unknown) {
    useEffect(() => {
        if (!error) return;
        const fallback = 'Unable to complete the request. Please try again.';

        const message = isAxiosError(error)
            ? ((error.response?.data as { message?: string } | undefined)?.message ?? fallback)
            : fallback;

        if (Array.isArray(message)) {
            message.forEach(item => toast.error(item, { title: 'Error' }));
        } else {
            toast.error(message, { title: 'Error' });
        }
    }, [error]);
}
