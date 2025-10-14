'use client';

import { type UserCurrentUseCase } from '@/server/application/useCases/userCurrent/userCurrent.useCase';
import { createContext, useContext, useState } from 'react';

type LoggedUser = Awaited<ReturnType<UserCurrentUseCase['execute']>>;
type LoggedUserAccounts = NonNullable<LoggedUser>['accounts'];

interface AuthContextType {
  user: LoggedUser;
  setUser: (user: LoggedUser) => void;
  setUserAccounts: (accounts: LoggedUserAccounts) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ user, children }: { user: LoggedUser; children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<LoggedUser>(user);

  const setUserAccounts = (accounts: LoggedUserAccounts) => {
    setCurrentUser(prev => prev ? { ...prev, accounts } : prev);
  };

  return (
    <AuthContext.Provider value={{
      user: currentUser,
      setUser: setCurrentUser,
      setUserAccounts: setUserAccounts
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthProvider() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthProvider must be used within an AuthProvider');
  }
  return context;
}