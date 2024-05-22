import { useContext } from 'react';

import { LoanCtx } from '@/pages/loan/context/LoanCtx';

export default function useLoan() {
  // Global state
  const {
    loan,
    loanDispatcher: _loanDispatcher,
    isEditing,
    setIsEditing,
  } = useContext(LoanCtx);

  // Wrappers

  return {
    loan,
    isEditing,
    setIsEditing,
  };
}
