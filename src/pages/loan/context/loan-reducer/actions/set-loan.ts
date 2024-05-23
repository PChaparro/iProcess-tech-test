import { Loan } from '@/types/entities';

import { LoanCtxState } from '../../LoanCtx';

export function setLoanAction(state: LoanCtxState, loan: Loan): LoanCtxState {
  state = {
    ...state,
    loan,
  };

  return state;
}
