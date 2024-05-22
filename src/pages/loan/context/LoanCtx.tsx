import { Loan } from '@/types/entities';
import React, {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import {
  LoanCtxAction,
  LoanCtxActionType,
  loanCtxReducer,
} from './LoanCtxReducer';

import useLoans from '@/hooks/useLoans';

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
  // Get all loans
  const { loans } = useLoans();

  // Current loan state
  const [loan, loanDispatcher] = useReducer(loanCtxReducer, null);
  const [isEditing, setIsEditing] = useState(false);

  // Get the loan according to the id from the url
  const { id } = useParams();

  useEffect(() => {
    const loan = loans.find((loan) => loan.id === id);

    if (loan) {
      loanDispatcher({ type: LoanCtxActionType.SET_LOAN, payload: loan });
    }
  }, [id, loans]);

  return (
    <LoanCtx.Provider value={{ loan, loanDispatcher, isEditing, setIsEditing }}>
      {children}
    </LoanCtx.Provider>
  );
}
