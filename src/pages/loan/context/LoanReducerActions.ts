import { Loan, Payment, PaymentMethod } from '@/types/entities';

export enum LoanCtxActionType {
  SET_LOAN, // Initialize the loan state
  UPDATE_PAYMENT_PERCENTAGE,
  UPDATE_PAYMENT_INFO,
  ADD_NEW_PAYMENT,
  MARK_PAYMENT_AS_PAID,
  RESET_ERROR,
  RESET_CONFIRMATION_MESSAGE,
}

export type LoanReducerAction =
  | {
      type: LoanCtxActionType.SET_LOAN;
      payload: Loan;
    }
  | {
      type: LoanCtxActionType.UPDATE_PAYMENT_PERCENTAGE;
      payload: {
        paymentId: string;
        percentage: number;
      };
    }
  | {
      type: LoanCtxActionType.UPDATE_PAYMENT_INFO;
      payload: Payment;
    }
  | {
      type: LoanCtxActionType.ADD_NEW_PAYMENT;
      payload: {
        index: number;
      };
    }
  | {
      type: LoanCtxActionType.MARK_PAYMENT_AS_PAID;
      payload: {
        paymentId: string;
        method: PaymentMethod;
      };
    }
  | {
      type: LoanCtxActionType.RESET_ERROR;
    }
  | {
      type: LoanCtxActionType.RESET_CONFIRMATION_MESSAGE;
    };
