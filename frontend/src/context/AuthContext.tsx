import { createContext, useContext, useState } from 'react';
import type { AuthUserDto } from '../api';

interface AuthContextType {
  user: AuthUserDto | null;
  setUser: (user: AuthUserDto | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserDto | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
