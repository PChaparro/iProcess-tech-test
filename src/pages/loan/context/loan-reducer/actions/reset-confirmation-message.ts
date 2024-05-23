import { LoanCtxState } from '../../LoanCtx';

export function resetConfirmationMessageAction(state: LoanCtxState) {
  state = {
    ...state,
    confirmationMessage: '',
  };

  return state;
}
