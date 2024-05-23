import { isPaymentPercentageValid } from '@/lib/utils';
import { Loan, Payment } from '@/types/entities';

import { LoanCtxState } from './LoanCtx';

export enum LoanCtxActionType {
  SET_LOAN, // Initialize the loan state
  UPDATE_PAYMENT_PERCENTAGE,
  UPDATE_PAYMENT_INFO,
  RESET_ERROR,
  RESET_CONFIRMATION_MESSAGE,
}

export type LoanCtxAction =
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
      type: LoanCtxActionType.RESET_ERROR;
    }
  | {
      type: LoanCtxActionType.RESET_CONFIRMATION_MESSAGE;
    };

export function loanCtxReducer(
  state: LoanCtxState,
  action: LoanCtxAction,
): LoanCtxState {
  try {
    switch (action.type) {
      case LoanCtxActionType.SET_LOAN: {
        state = {
          ...state,
          loan: action.payload,
        };

        return state;
      }

      case LoanCtxActionType.UPDATE_PAYMENT_PERCENTAGE: {
        // Ensure that the loan state was set
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

        // Validate that the payment has a 'neighbor' payment
        let indexOfClosestPayment: number;

        if (indexOfPaymentToUpdate === 0) {
          // The closest payment of the fist payment is the payment at its right
          indexOfClosestPayment = 1;
        } else {
          // The closest payment of any other payment is the payment at its left
          indexOfClosestPayment = indexOfPaymentToUpdate - 1;
        }

        const closestPaymentIsOutOfRange =
          indexOfClosestPayment < 0 ||
          indexOfClosestPayment >= loan.payments.length;

        if (closestPaymentIsOutOfRange) {
          throw new Error(
            'Para actualizar el porcentaje de pago, se necesita un pago adyacente',
          );
        }

        // Validate the new percentage of the affected payments
        const paymentToUpdate = loan.payments[indexOfPaymentToUpdate];
        const closestPayment = loan.payments[indexOfClosestPayment];

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

      case LoanCtxActionType.UPDATE_PAYMENT_INFO: {
        // Ensure that the loan state was set
        if (!state.loan) {
          throw new Error('No se ha encontrado el préstamo');
        }

        const updatedPayment = action.payload;

        const { loan } = state;

        const updatedPayments = loan.payments.map((payment) => {
          if (payment.id === updatedPayment.id) {
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

      case LoanCtxActionType.RESET_ERROR: {
        state = {
          ...state,
          errorMessage: '',
        };

        return state;
      }

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
