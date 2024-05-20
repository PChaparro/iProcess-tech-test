import { Loan } from '@/types/entities';
import { useContext, useEffect } from 'react';

import { LoanCtxActionType } from '../context/LoanCtxReducer';

import { LoanCtx } from '@/pages/loan/context/LoanCtx';

import useLoans from '@/hooks/useLoans';

interface UseLoanProps {
  id: string;
}

export default function useLoan({ id }: UseLoanProps) {
  // Global state
  const { loan, loanDispatcher, isEditing, setIsEditing } = useContext(LoanCtx);
  const { loans } = useLoans();

  // Wrappers
  const setLoan = (loan: Loan) => {
    loanDispatcher({ type: LoanCtxActionType.SET_LOAN, payload: loan });
  };

  // Effects
  useEffect(() => {
    // TODO: In a real scenario, a request to an API should be made here to get the loan.
    const loan = loans.find((loan) => loan.id === id);
    if (loan) setLoan(loan);
  }, [loans]);

  return {
    loan,
    setLoan,
    isEditing,
    setIsEditing,
  };
}
