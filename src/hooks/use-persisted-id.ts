import { useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import { v4 as uuidv4 } from 'uuid';

export const usePersistedId = (
  key: string,
): {
  id: string | null;
  clearId: () => void;
  setPersistedId: (newId: string) => void;
  generateNewId: () => string;
} => {
  const [id, setId] = useQueryState(key);

  const clearId = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(key);
    }
    setId(null);
  }, [key, setId]);

  const setPersistedId = useCallback(
    (newId: string) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, newId);
      }
      setId(newId);
    },
    [key, setId],
  );

  const generateNewId = useCallback(() => {
    const newId = uuidv4();
    setPersistedId(newId);
    return newId;
  }, [setPersistedId]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const existingId = sessionStorage.getItem(key);
      if (existingId && id !== existingId) {
        setId(existingId);
      }
    }
  }, [key, id, setId]);

  return { id: id ?? null, clearId, setPersistedId, generateNewId };
};
