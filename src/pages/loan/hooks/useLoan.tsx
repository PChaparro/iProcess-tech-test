import { Payment, PaymentMethod } from '@/types/entities';
import { useContext } from 'react';

import { LoanCtxActionType } from '../context/loan-reducer/LoanReducerActions';

import { LoanCtx } from '@/pages/loan/context/LoanCtx';

export default function useLoan() {
  // Global state
  const { loanState, loanDispatcher, isEditing, setIsEditing, syncChanges } =
    useContext(LoanCtx);

  const { loan } = loanState;

  // Wrappers
  const updatePaymentPercentage = (paymentId: string, percentage: number) => {
    // TODO: In a real scenario, a request to an API should be made here to update the payment percentage.
    loanDispatcher({
      type: LoanCtxActionType.UPDATE_PAYMENT_PERCENTAGE,
      payload: { paymentId, percentage },
    });
  };

  const updatePaymentInfo = (updatedPayment: Payment) => {
    // TODO: In a real scenario, a request to an API should be made here to update the payment info.
    loanDispatcher({
      type: LoanCtxActionType.UPDATE_PAYMENT_INFO,
      payload: updatedPayment,
    });
  };

  const addNewPaymentAt = (index: number) => {
    // TODO: In a real scenario, a request to an API should be made here to add a new payment.
    loanDispatcher({
      type: LoanCtxActionType.ADD_NEW_PAYMENT,
      payload: { index },
    });

    setIsEditing(true);
  };

  const markPaymentAsPaid = (paymentId: string, method: PaymentMethod) => {
    // TODO: In a real scenario, a request to an API should be made here to mark the payment as paid.
    loanDispatcher({
      type: LoanCtxActionType.MARK_PAYMENT_AS_PAID,
      payload: { paymentId, method },
    });

    syncChanges();
  };

  return {
    loan,
    isEditing,
    setIsEditing,
    updatePaymentPercentage,
    updatePaymentInfo,
    addNewPaymentAt,
    markPaymentAsPaid,
  };
}
