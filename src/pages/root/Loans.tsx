import LoansTable from './components/LoansTable';

import CreateLoanDialog from '@/pages/root/components/CreateLoanDialog';

import useLoans from '@/hooks/useLoans';

export default function Loans() {
  const { loans, addLoan } = useLoans();

  return (
    <main>
      <header className='mb-4 flex flex-wrap justify-between gap-4 border-b pb-4'>
        <h1 className='text-2xl font-bold text-primary'>
          Listado de préstamos
        </h1>
        <CreateLoanDialog addLoanCallback={addLoan} />
      </header>
      <LoansTable loans={loans} />
    </main>
  );
}
