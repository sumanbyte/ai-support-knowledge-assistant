const ACCESS_TOKEN_KEY = 'converse_access_token';
const REFRESH_TOKEN_KEY = 'converse_refresh_token';

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

function readFromStorage(): void {
  try {
    memoryAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    memoryRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    memoryAccessToken = null;
    memoryRefreshToken = null;
  }
}

readFromStorage();

export const tokenStore = {
  getAccessToken: (): string | null => memoryAccessToken,
  getRefreshToken: (): string | null => memoryRefreshToken,

  /** @deprecated use getAccessToken */
  getToken: (): string | null => memoryAccessToken,

  setTokens: (accessToken: string, refreshToken: string): void => {
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // Private mode / storage quota — in-memory only
    }
  },

  /** @deprecated use setTokens */
  setToken: (accessToken: string): void => {
    memoryAccessToken = accessToken;
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch {
      // ignore
    }
  },

  clearTokens: (): void => {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  /** @deprecated use clearTokens */
  clearToken: (): void => {
    tokenStore.clearTokens();
  },
};
