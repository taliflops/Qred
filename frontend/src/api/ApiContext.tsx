import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CardStatus, OverviewResponse } from '../types';

interface ApiContextValue {
  overview: OverviewResponse | null;
  error: string | null;
  isUpdating: boolean;
  selectAccount: (accountId: string) => Promise<void>;
  setCardStatus: (cardId: string, status: CardStatus) => Promise<void>;
}

const ApiContext = createContext<ApiContextValue | null>(null);

interface ApiProviderProps {
  userId: string;
  baseUrl?: string;
  children: ReactNode;
}

export function ApiProvider({ userId, baseUrl = '/api', children }: ApiProviderProps) {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Every endpoint responds with the full overview, so each call just replaces it.
  const request = useCallback(
    async (path: string, init?: RequestInit) => {
      setIsUpdating(true);
      try {
        const res = await fetch(`${baseUrl}/user/${userId}${path}`, {
          ...init,
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        setOverview(await res.json());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsUpdating(false);
      }
    },
    [baseUrl, userId],
  );

  useEffect(() => {
    request('');
  }, [request]);

  const selectAccount = useCallback(
    (accountId: string) => request(`/account/${accountId}`, { method: 'POST' }),
    [request],
  );

  const setCardStatus = useCallback(
    (cardId: string, status: CardStatus) =>
      request(`/card/${cardId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    [request],
  );

  return (
    <ApiContext.Provider value={{ overview, error, isUpdating, selectAccount, setCardStatus }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within an ApiProvider');
  return context;
}
