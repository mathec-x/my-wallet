'use client';

import { createContext, memo, useContext } from 'react';
import { UsePwaInterface } from './PwaTypes';
import useRegistration from './useRegistration';

export const PwaContext = createContext<UsePwaInterface>({});

const ReactPwa: React.FC<{ children: React.ReactNode }> = (props) => {
  const { done, ...registration } = useRegistration({
    test: false,
    config: {
      swUrl: '/service-worker.js',
      onError: (err) => { console.error('Service Worker registration failed:', err); },
      onPrompt: () => { console.log('PWA install prompt triggered'); },
      onSuccess: () => { console.log('Service Worker registered successfully'); },
      onUpdate: () => { console.log('Service Worker update found'); },
    }
  });

  return (
    <PwaContext.Provider value={registration}>
      {props.children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => useContext(PwaContext);

export default memo(ReactPwa);