import { Loan } from '@/types/entities';
import React, { ReactNode, createContext, useReducer, useState } from 'react';

import { LoanCtxAction, loanCtxReducer } from './LoanCtxReducer';

interface LoadCtxType {
  loan: Loan | null;
  loanDispatcher: React.Dispatch<LoanCtxAction>;

  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const defaultLoanCtxValues: LoadCtxType = {
  loan: null,
  loanDispatcher: () => null,

  isEditing: false,
  setIsEditing: () => {},
};

export const LoanCtx = createContext<LoadCtxType>(defaultLoanCtxValues);

export function LoanCtxProvider({ children }: { children: ReactNode }) {
  const [loan, loanDispatcher] = useReducer(loanCtxReducer, null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <LoanCtx.Provider value={{ loan, loanDispatcher, isEditing, setIsEditing }}>
      {children}
    </LoanCtx.Provider>
  );
}
