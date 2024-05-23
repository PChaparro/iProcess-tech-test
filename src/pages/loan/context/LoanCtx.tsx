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
import useToast from '@/hooks/useToast';

export interface LoanCtxState {
  loan: Loan | null;
  errorMessage: string;
  confirmationMessage?: string;
}

interface LoadCtxType {
  loanState: LoanCtxState;
  loanDispatcher: React.Dispatch<LoanCtxAction>;

  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const defaultLoanState: LoanCtxState = {
  loan: null,
  errorMessage: '',
  confirmationMessage: '',
};

const defaultLoanCtxValues: LoadCtxType = {
  loanState: defaultLoanState,
  loanDispatcher: () => null,

  isEditing: false,
  setIsEditing: () => {},
};

export const LoanCtx = createContext<LoadCtxType>(defaultLoanCtxValues);

export function LoanCtxProvider({ children }: { children: ReactNode }) {
  const { showSuccessToast, showErrorToast } = useToast();

  // Get all loans
  const { loans, updateLoan } = useLoans();

  // Current loan state
  const [loanState, loanDispatcher] = useReducer(
    loanCtxReducer,
    defaultLoanState,
  );
  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();

  // Helpers
  const setIsEditingAndSync = (isEditing: boolean) => {
    setIsEditing(isEditing);

    if (!isEditing) {
      updateLoan(loanState.loan!);
      showSuccessToast('El préstamo ha sido actualizado');
    }
  };

  // Get the loan according to the id from the url
  useEffect(() => {
    const loan = loans.find((loan) => loan.id === id);

    if (loan) {
      loanDispatcher({ type: LoanCtxActionType.SET_LOAN, payload: loan });
    }
  }, [id, loans]);

  // Handle errors from the dispatcher
  useEffect(() => {
    if (loanState.errorMessage) {
      showErrorToast(loanState.errorMessage);
      loanDispatcher({ type: LoanCtxActionType.RESET_ERROR });
    }
  }, [loanState.errorMessage]);

  // Handle success messages from the dispatcher
  useEffect(() => {
    if (loanState.confirmationMessage) {
      showSuccessToast(loanState.confirmationMessage);
      loanDispatcher({ type: LoanCtxActionType.RESET_CONFIRMATION_MESSAGE });
    }
  }, [loanState.confirmationMessage]);

  return (
    <LoanCtx.Provider
      value={{
        loanState,
        loanDispatcher,
        isEditing,
        setIsEditing: setIsEditingAndSync,
      }}
    >
      {children}
    </LoanCtx.Provider>
  );
}
