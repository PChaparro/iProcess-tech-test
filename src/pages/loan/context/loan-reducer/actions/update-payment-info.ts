import { Payment, PaymentStatus } from '@/types/entities';

import { LoanCtxState } from '../../LoanCtx';

export function updatePaymentInfoAction(
  state: LoanCtxState,
  updatedPayment: Payment,
): LoanCtxState {
  // Check that the loan state was set
  if (!state.loan) {
    throw new Error('No se ha encontrado el préstamo');
  }

  const { loan } = state;

  const updatedPayments = loan.payments.map((payment) => {
    if (payment.id === updatedPayment.id) {
      // Prevent the payment from being updated if it was already paid
      if (payment.status === PaymentStatus.PAID) {
        throw new Error('No se puede actualizar un pago que ya fue pagado');
      }

      return updatedPayment;
    }

    return payment;
  });

  state = {
    ...state,
    loan: {
      ...loan,
      payments: updatedPayments,
    },
  };

  return state;
}
