import { Routes, Route } from 'react-router-dom';

import Pagos from '@/pages/loan/Pagos';
import Loans from '@/pages/root/Loans';

export default function App() {
  return (
    <Routes>
      {/* List of loans */}
      <Route path='/' element={<Loans />} />
      {/* Specific loan payments */}
      <Route path='/loan/:id' element={<Pagos />} />
    </Routes>
  );
}
