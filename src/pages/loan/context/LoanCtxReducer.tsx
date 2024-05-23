import { formatDateToYYYYMMDD, getRandomPaymentId } from '@/lib/utils';
import { Payment, PaymentStatus } from '@/types/entities';

import { isPaymentPercentageValid } from '../utils/utils';
import { LoanCtxState } from './LoanCtx';
import { LoanCtxActionType, LoanReducerAction } from './LoanReducerActions';

export function loanCtxReducer(
  state: LoanCtxState,
  action: LoanReducerAction,
): LoanCtxState {
  try {
    switch (action.type) {
      // #region SET_LOAN
      case LoanCtxActionType.SET_LOAN: {
        state = {
          ...state,
          loan: action.payload,
        };

        return state;
      }

      // #region UPDATE_PAYMENT_PERCENTAGE
      case LoanCtxActionType.UPDATE_PAYMENT_PERCENTAGE: {
        // Check that the loan state was set
        if (!state.loan) {
          throw new Error('No se ha encontrado el préstamo');
        }

        const {
          paymentId: idOfPaymentToUpdate,
          percentage: newPercentageToSet,
        } = action.payload;

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
          indexOfClosestPayment < 0 ||
          indexOfClosestPayment >= loan.payments.length;

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
        const paymentPercentageDiff =
          newPercentageToSet - paymentToUpdate.percentage;

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
          throw new Error(
            'La suma de los porcentajes de los pagos debe ser 100',
          );
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

      // #region UPDATE_PAYMENT_INFO
      case LoanCtxActionType.UPDATE_PAYMENT_INFO: {
        // Check that the loan state was set
        if (!state.loan) {
          throw new Error('No se ha encontrado el préstamo');
        }

        const updatedPayment = action.payload;

        const { loan } = state;

        const updatedPayments = loan.payments.map((payment) => {
          if (payment.id === updatedPayment.id) {
            // Prevent the payment from being updated if it was already paid
            if (payment.status === PaymentStatus.PAID) {
              throw new Error(
                'No se puede actualizar un pago que ya fue pagado',
              );
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

      // #region ADD_NEW_PAYMENT
      case LoanCtxActionType.ADD_NEW_PAYMENT: {
        // Check that the loan state was set
        if (!state.loan) {
          throw new Error('No se ha encontrado el préstamo');
        }

        const { index } = action.payload;
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
        if (
          loan.payments[indexOfClosestPayment].status === PaymentStatus.PAID
        ) {
          if (!fallbackToNextPayment) {
            throw new Error(
              'No se puede agregar un nuevo pago si el pago adyacente está pagado',
            );
          }

          // Fallback to the payment at the right
          indexOfClosestPayment = index + 1;
        }

        const currentPercentage =
          loan.payments[indexOfClosestPayment].percentage;

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

      // #region MARK_PAYMENT_AS_PAID
      case LoanCtxActionType.MARK_PAYMENT_AS_PAID: {
        // Check that the loan state was set
        if (!state.loan) {
          throw new Error('No se ha encontrado el préstamo');
        }

        const { paymentId, method } = action.payload;
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

      // #region RESET_ERROR
      case LoanCtxActionType.RESET_ERROR: {
        state = {
          ...state,
          errorMessage: '',
        };

        return state;
      }

      // #region RESET_CONFIRMATION_MESSAGE
      case LoanCtxActionType.RESET_CONFIRMATION_MESSAGE: {
        state = {
          ...state,
          confirmationMessage: '',
        };

        return state;
      }

      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  } catch (error) {
    let errorMessage = 'Ocurrió un error al completar la acción';

    if (error instanceof Error && error.message) {
      errorMessage = error.message;
    }

    return {
      ...state,
      errorMessage: errorMessage,
    };
  }
}
