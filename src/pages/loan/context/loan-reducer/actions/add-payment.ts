import { formatDateToYYYYMMDD, getRandomPaymentId } from '@/lib/utils';
import { Payment, PaymentStatus } from '@/types/entities';

import { LoanCtxState } from '../../LoanCtx';

export function addPaymentAction(
  state: LoanCtxState,
  index: number,
): LoanCtxState {
  // Check that the loan state was set
  if (!state.loan) {
    throw new Error('No se ha encontrado el préstamo');
  }

  const { loan } = state;

  // Validate the index
  const indexIsOutOfRange = index < 0 || index > loan.payments.length;
  if (indexIsOutOfRange) {
    throw new Error('El índice del pago a agregar no es válido');
  }

  // Validate that the index has, at least, one 'neighbor' payment that is not paid
  const previousPaymentIndex = index - 1;
  const nextPaymentIndex = index;

  const previousPaymentIsAvailable =
    previousPaymentIndex >= 0 &&
    loan.payments[previousPaymentIndex].status === PaymentStatus.PENDING;

  const nextPaymentIsAvailable =
    nextPaymentIndex < loan.payments.length &&
    loan.payments[nextPaymentIndex].status === PaymentStatus.PENDING;

  if (!previousPaymentIsAvailable && !nextPaymentIsAvailable) {
    throw new Error(
      'No se puede agregar un nuevo pago si los pagos adyacentes están pagados',
    );
  }

  // By default, the closest payment is the payment at the left
  let indexOfClosestPayment: number = index - 1;

  /**If the payment at the left does not exist or was paid,
   * the closest payment is the payment at the right
   */
  let fallbackToNextPayment: boolean = true;

  if (index === 0) {
    // The closest payment to a new payment at the beginning is the current first payment
    indexOfClosestPayment = 0;
    // We're already checking the payment at the right
    fallbackToNextPayment = false;
  }

  // Validate the new payment
  if (loan.payments[indexOfClosestPayment].status === PaymentStatus.PAID) {
    if (!fallbackToNextPayment) {
      throw new Error(
        'No se puede agregar un nuevo pago si el pago adyacente está pagado',
      );
    }

    // Fallback to the payment at the right
    indexOfClosestPayment = index;
  }

  const currentPercentage = loan.payments[indexOfClosestPayment].percentage;

  const splittedPercentage = currentPercentage / 2;

  const oneMothFromNow = new Date();
  oneMothFromNow.setMonth(oneMothFromNow.getMonth() + 1);

  const newPayment: Payment = {
    id: getRandomPaymentId(),
    title: 'Nuevo',
    percentage: splittedPercentage,
    expectedPaymentDate: formatDateToYYYYMMDD(oneMothFromNow),
    status: PaymentStatus.PENDING,
  };

  // Insert the payment
  const updatedPayments = loan.payments.map((payment, i) => {
    if (i === indexOfClosestPayment) {
      return {
        ...payment,
        percentage: splittedPercentage,
      };
    }

    return payment;
  });

  updatedPayments.splice(index, 0, newPayment);

  state = {
    ...state,
    loan: {
      ...loan,
      payments: updatedPayments,
    },
  };

  return state;
}
