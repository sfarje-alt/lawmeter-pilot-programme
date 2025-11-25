import { useState, useEffect } from 'react';

const STARRED_BILLS_KEY = 'starred_congress_bills';

export function useStarredBills() {
  const [starredBills, setStarredBills] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(STARRED_BILLS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(STARRED_BILLS_KEY, JSON.stringify(Array.from(starredBills)));
  }, [starredBills]);

  const toggleStar = (billId: string) => {
    setStarredBills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(billId)) {
        newSet.delete(billId);
      } else {
        newSet.add(billId);
      }
      return newSet;
    });
  };

  const isStarred = (billId: string) => starredBills.has(billId);

  return { starredBills, toggleStar, isStarred };
}
