'use client';

import { BalanceService } from '@/app/providers/balance/BalanceService';
import { createContext, useContext, useState } from 'react';
import { Entry } from '../entries/EntriesType';


const BalanceContext = createContext<BalanceService<Entry> | undefined>(undefined);

interface BalanceProviderProps {
  values: Entry[];
}

export function BalanceProvider(props: React.PropsWithChildren<BalanceProviderProps>) {
  const [values, setValues] = useState(props.values);

  return (
    <BalanceContext.Provider value={new BalanceService(values, setValues)}>{props.children}</BalanceContext.Provider>
  );
}

export function useBalanceFactory() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within an BalanceProvider');
  }
  return context;
}
