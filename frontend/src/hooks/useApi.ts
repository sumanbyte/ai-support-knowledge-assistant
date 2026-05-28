import { useState, useCallback } from 'react';

export function useApi<TData, TArgs extends unknown[]>(
    apiFunc: (...args: TArgs) => Promise<TData>,
) {
    const [data, setData] = useState<TData | null>(null);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);
    const [variables, setVariables] = useState<TArgs | null>(null);

    const execute = useCallback(
        async (...args: TArgs) => {
            setVariables(args);
            setLoading(true);
            setError(null);
            try {
                const result = await apiFunc(...args);
                setData(result);
                return result;
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        },
        [apiFunc],
    );

    return { data, error, loading, variables, execute };
}
