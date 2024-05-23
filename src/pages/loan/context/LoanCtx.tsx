import { Loan } from '@/types/entities';
import React, {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';

import { loanCtxReducer } from './loan-reducer/LoanCtxReducer';
import {
  LoanCtxActionType,
  LoanReducerAction,
} from './loan-reducer/LoanReducerActions';

import useLoans from '@/hooks/useLoans';
import useToast from '@/hooks/useToast';

export interface LoanCtxState {
  loan: Loan | null;
  errorMessage: string;
  confirmationMessage?: string;
}

interface LoadCtxType {
  loanState: LoanCtxState;
  loanDispatcher: React.Dispatch<LoanReducerAction>;

  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;

  syncChanges: () => void;
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

  syncChanges: () => {},
};

export const LoanCtx = createContext<LoadCtxType>(defaultLoanCtxValues);

export function LoanCtxProvider({ children }: { children: ReactNode }) {
  const { showSuccessToast, showErrorToast } = useToast();

  // Get all loans
  const { loans, updateLoan } = useLoans();

  // Get the id of the loan from the url
  const { id } = useParams();

  // Current loan state
  const [loanState, loanDispatcher] = useReducer(
    loanCtxReducer,
    defaultLoanState,
  );

  const [isEditing, setIsEditing] = useState(false);

  const [updateCompleted, setUpdateCompleted] = useState(false);

  // Helpers
  const saveChanges = () => {
    if (loanState.loan) updateLoan(loanState.loan);
  };

  const syncChanges = () => setUpdateCompleted(true);

  const setIsEditingAndSync = (isEditing: boolean) => {
    setIsEditing(isEditing);
    if (!isEditing) syncChanges();
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

  // Sync the loan with the local storage after some change is written
  useEffect(() => {
    if (updateCompleted) {
      saveChanges();
      setUpdateCompleted(false);
    }
  }, [updateCompleted]);

  return (
    <LoanCtx.Provider
      value={{
        // Loan reducer
        loanState,
        loanDispatcher,
        // Editing state
        isEditing,
        setIsEditing: setIsEditingAndSync,
        // State to sync the changes
        syncChanges,
      }}
    >
      {children}
    </LoanCtx.Provider>
  );
}
