import { Routes, Route } from 'react-router-dom';

import Pagos from '@/pages/loan/Pagos';
import { LoanCtxProvider } from '@/pages/loan/context/LoanCtx';
import Loans from '@/pages/root/Loans';

export default function App() {
  return (
    <div className='mx-auto max-w-screen-xl p-4'>
      <Routes>
        {/* List of loans */}
        <Route path='/' element={<Loans />} />
        {/* Specific loan payments */}
        <Route
          path='/loan/:id'
          element={
            <LoanCtxProvider>
              <Pagos />
            </LoanCtxProvider>
          }
        />
      </Routes>
    </div>
  );
}
