let memoryToken: string | null = null;

export const tokenStore = {
    setToken: (token: string) => { memoryToken = token; },
    getToken: () => memoryToken,
    clearToken: () => { memoryToken = null; }
};
