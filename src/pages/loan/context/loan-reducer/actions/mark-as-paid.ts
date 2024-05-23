import { formatDateToYYYYMMDD } from '@/lib/utils';
import { PaymentMethod, PaymentStatus } from '@/types/entities';

import { LoanCtxState } from '../../LoanCtx';

export interface MarkAsPaidActionPayload {
  paymentId: string;
  method: PaymentMethod;
}

export function markAsPaidAction(
  state: LoanCtxState,
  { paymentId, method }: MarkAsPaidActionPayload,
): LoanCtxState {
  // Check that the loan state was set
  if (!state.loan) {
    throw new Error('No se ha encontrado el préstamo');
  }

  const { loan } = state;

  // Check that the payment to mark as paid exists
  const indexOfPaymentToMarkAsPaid = loan.payments.findIndex(
    (payment) => payment.id === paymentId,
  );

  const paymentNotFound = indexOfPaymentToMarkAsPaid === -1;
  if (paymentNotFound) {
    throw new Error(
      'El pago que estás intentando marcar como pagado no fue encontrado',
    );
  }

  // Check that the payment to mark as paid is pending
  const paymentToMarkAsPaid = loan.payments[indexOfPaymentToMarkAsPaid];

  const paymentIsAlreadyPaid =
    paymentToMarkAsPaid.status === PaymentStatus.PAID;
  if (paymentIsAlreadyPaid) {
    throw new Error('El pago ya fue marcado como pagado');
  }

  // Check that the previous payment is paid
  const previousPaymentIndex = indexOfPaymentToMarkAsPaid - 1;

  if (previousPaymentIndex >= 0) {
    const previousPayment = loan.payments[previousPaymentIndex];

    const previousPaymentIsNotPaid =
      previousPayment.status !== PaymentStatus.PAID;

    if (previousPaymentIsNotPaid) {
      throw new Error(
        'No se puede marcar un pago como pagado si el pago anterior no ha sido pagado',
      );
    }
  }

  // Update the payment
  const updatedPayments = loan.payments.map((payment, index) => {
    if (index === indexOfPaymentToMarkAsPaid) {
      return {
        ...payment,
        status: PaymentStatus.PAID,
        paymentMethod: method,
        paymentDate: formatDateToYYYYMMDD(new Date()),
      };
    }

    return payment;
  });

  state = {
    ...state,
    loan: {
      ...loan,
      payments: updatedPayments,
    },
    confirmationMessage: 'El pago ha sido marcado como pagado',
  };

  return state;
}
