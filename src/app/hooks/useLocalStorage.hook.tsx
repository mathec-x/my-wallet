'use client';

import { useEffect, useState } from 'react';

export enum STORAGE {
  LOCK_BOARD = 'lock-boards',
  GROUP_CATEGORY = 'group-category'
}

function useLocalStorage<T>(key: `${STORAGE}`, initialValue: T): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Erro ao ler localStorage key “' + key + '”: ', error);
    } finally {
      setInitialized(true);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Erro ao definir localStorage key “' + key + '”: ', error);
    }
  };

  return [storedValue, setValue, initialized];
}

export default useLocalStorage;