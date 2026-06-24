// AuthContext stub - Base44 auth removed
import { createContext, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return {
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    user: null,
    navigateToLogin: () => {},
  };
}

export default AuthContext;
