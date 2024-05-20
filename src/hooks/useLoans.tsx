import { Loan } from '@/types/entities';
import { useEffect, useState } from 'react';

import { useLocalStorage } from './useLocalStorage';

export default function useLoans() {
  const { getFromLocalStorage, saveToLocalStorage } = useLocalStorage();

  // State
  const [loans, setLoans] = useState<Loan[]>([]);

  // Effects
  useEffect(() => {
    // TODO: In a real scenario, a request to an API should be made here to get the loans.
    const loans = getFromLocalStorage<Loan[]>('loans');
    if (loans) setLoans(loans);
  }, []);

  // Wrappers
  const addLoan = (loan: Loan) => {
    const updatedLoans = [...loans, loan];
    setLoans(updatedLoans);
    saveToLocalStorage('loans', JSON.stringify(updatedLoans));
  };

  return {
    loans,
    addLoan,
  };
}
