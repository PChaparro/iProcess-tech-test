import { Payment } from '@/types/entities';
import { useContext } from 'react';

import { LoanCtxActionType } from '../context/LoanCtxReducer';

import { LoanCtx } from '@/pages/loan/context/LoanCtx';

export default function useLoan() {
  // Global state
  const { loanState, loanDispatcher, isEditing, setIsEditing } =
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

  return {
    loan,
    isEditing,
    setIsEditing,
    updatePaymentPercentage,
    updatePaymentInfo,
  };
}
