import { LoanCtxState } from '../LoanCtx';
import { LoanCtxActionType, LoanReducerAction } from './LoanReducerActions';
import { addPaymentAction } from './actions/add-payment';
import { markAsPaidAction } from './actions/mark-as-paid';
import { resetConfirmationMessageAction } from './actions/reset-confirmation-message';
import { resetErrorAction } from './actions/reset-error';
import { setLoanAction } from './actions/set-loan';
import { updatePaymentInfoAction } from './actions/update-payment-info';
import { updatePaymentPercentageAction } from './actions/update-payment-percentage';

export function loanCtxReducer(
  state: LoanCtxState,
  action: LoanReducerAction,
): LoanCtxState {
  try {
    switch (action.type) {
      case LoanCtxActionType.SET_LOAN:
        return setLoanAction(state, action.payload);

      case LoanCtxActionType.UPDATE_PAYMENT_PERCENTAGE:
        return updatePaymentPercentageAction(state, action.payload);

      case LoanCtxActionType.UPDATE_PAYMENT_INFO:
        return updatePaymentInfoAction(state, action.payload);

      case LoanCtxActionType.ADD_NEW_PAYMENT:
        return addPaymentAction(state, action.payload.index);

      case LoanCtxActionType.MARK_PAYMENT_AS_PAID:
        return markAsPaidAction(state, action.payload);

      case LoanCtxActionType.RESET_ERROR:
        return resetErrorAction(state);

      // #region RESET_CONFIRMATION_MESSAGE
      case LoanCtxActionType.RESET_CONFIRMATION_MESSAGE:
        return resetConfirmationMessageAction(state);

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
