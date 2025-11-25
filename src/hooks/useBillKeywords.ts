import { useState, useEffect } from 'react';

const BILL_KEYWORDS_KEY = 'congress_bill_keywords';

interface BillKeywords {
  [billId: string]: string[];
}

export function useBillKeywords() {
  const [billKeywords, setBillKeywords] = useState<BillKeywords>(() => {
    const stored = localStorage.getItem(BILL_KEYWORDS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(BILL_KEYWORDS_KEY, JSON.stringify(billKeywords));
  }, [billKeywords]);

  const addKeyword = (billId: string, keyword: string) => {
    setBillKeywords(prev => ({
      ...prev,
      [billId]: [...(prev[billId] || []), keyword.toLowerCase().trim()]
    }));
  };

  const removeKeyword = (billId: string, keyword: string) => {
    setBillKeywords(prev => ({
      ...prev,
      [billId]: (prev[billId] || []).filter(k => k !== keyword.toLowerCase().trim())
    }));
  };

  const getKeywords = (billId: string) => billKeywords[billId] || [];

  return { addKeyword, removeKeyword, getKeywords };
}
