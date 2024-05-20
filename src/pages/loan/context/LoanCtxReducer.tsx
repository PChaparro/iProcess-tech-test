import { Loan } from '@/types/entities';

export enum LoanCtxActionType {
  SET_LOAN, // Initialize the loan state
}

export type LoanCtxAction = {
  type: LoanCtxActionType.SET_LOAN;
  payload: Loan;
};

export function loanCtxReducer(
  state: Loan | null,
  action: LoanCtxAction,
): Loan | null {
  switch (action.type) {
    case LoanCtxActionType.SET_LOAN:
      state = action.payload;
      return state;
    default:
      return state;
  }
}
