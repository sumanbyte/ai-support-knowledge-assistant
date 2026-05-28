import { createContext, useCallback, useContext, useState } from 'react';
import { tokenStore } from '../config/token-store';
import type { AuthUserDto } from '../api';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthUserDto | null;
  setUser: (user: AuthUserDto | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserDto | null>(null);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local session even if the request fails
    } finally {
      tokenStore.clearToken();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
