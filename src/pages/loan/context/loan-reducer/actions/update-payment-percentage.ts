import { PaymentStatus } from '@/types/entities';

import { LoanCtxState } from '../../LoanCtx';

import { isPaymentPercentageValid } from '@/pages/loan/utils/utils';

export interface UpdatePaymentPercentageActionPayload {
  paymentId: string;
  percentage: number;
}

export function updatePaymentPercentageAction(
  state: LoanCtxState,
  payload: UpdatePaymentPercentageActionPayload,
): LoanCtxState {
  // Check that the loan state was set
  if (!state.loan) {
    throw new Error('No se ha encontrado el préstamo');
  }

  const { paymentId: idOfPaymentToUpdate, percentage: newPercentageToSet } =
    payload;

  const { loan } = state;

  // Validate that the payment to update exists
  const indexOfPaymentToUpdate = loan.payments.findIndex(
    (payment) => payment.id === idOfPaymentToUpdate,
  );

  const paymentNotFound = indexOfPaymentToUpdate === -1;
  if (paymentNotFound) {
    throw new Error(
      'El pago que estás intentando actualizar no fue encontrado',
    );
  }

  // By default, the closest payment is the payment at the left
  let indexOfClosestPayment = indexOfPaymentToUpdate - 1;

  if (indexOfPaymentToUpdate === 0) {
    // The closest payment of the fist payment is the payment at its right
    indexOfClosestPayment = 1;
  }

  // Validate that the payment has a 'neighbor' payment
  const closestPaymentIsOutOfRange =
    indexOfClosestPayment < 0 || indexOfClosestPayment >= loan.payments.length;

  if (closestPaymentIsOutOfRange) {
    throw new Error(
      'Para actualizar el porcentaje de pago, se necesita un pago adyacente',
    );
  }

  const paymentToUpdate = loan.payments[indexOfPaymentToUpdate];
  const closestPayment = loan.payments[indexOfClosestPayment];

  // Prevent the payments from being updated if they were already paid
  if (
    paymentToUpdate.status === PaymentStatus.PAID ||
    closestPayment.status === PaymentStatus.PAID
  ) {
    throw new Error('No se puede actualizar un pago que ya fue pagado');
  }

  // Validate the new percentage of the affected payments
  const paymentPercentageDiff = newPercentageToSet - paymentToUpdate.percentage;

  const updatedPayments = loan.payments.map((currentPayment, index) => {
    if (index === indexOfPaymentToUpdate) {
      return {
        ...paymentToUpdate,
        percentage: newPercentageToSet,
      };
    }

    if (index === indexOfClosestPayment) {
      return {
        ...closestPayment,
        percentage: closestPayment.percentage - paymentPercentageDiff,
      };
    }

    return currentPayment;
  });

  // Validate that the percentage of the updated payments is valid
  let totalPercentage = 0;

  for (const payment of updatedPayments) {
    totalPercentage += payment.percentage;

    if (!isPaymentPercentageValid(payment.percentage)) {
      throw new Error(
        'Los porcentajes de los pagos luego de la actualización no son válidos',
      );
    }
  }

  const totalPercentageIsNotValid = totalPercentage !== 100;
  if (totalPercentageIsNotValid) {
    throw new Error('La suma de los porcentajes de los pagos debe ser 100');
  }

  state = {
    ...state,
    loan: {
      ...loan,
      payments: updatedPayments,
    },
  };

  return state;
}
