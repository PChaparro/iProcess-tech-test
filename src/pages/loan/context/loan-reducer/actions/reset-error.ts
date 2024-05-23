import { LoanCtxState } from '../../LoanCtx';

export function resetErrorAction(state: LoanCtxState): LoanCtxState {
  state = {
    ...state,
    errorMessage: '',
  };

  return state;
}
