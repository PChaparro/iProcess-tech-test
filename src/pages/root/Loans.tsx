import { CONSTANTS } from '@/config/constants';
import { EditIcon } from 'lucide-react';

import CreateLoanDialog from './components/CreateLoanDialog';

import useLoans from '@/hooks/useLoans';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Loans() {
  const { loans, addLoan } = useLoans();
  const noLoans = loans.length === 0;

  return (
    <main>
      <header className='mb-4 flex flex-wrap justify-between gap-4 border-b pb-4'>
        <h1 className='text-primary text-3xl font-bold'>
          Listado de préstamos
        </h1>
        <CreateLoanDialog addLoanCallback={addLoan} />
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Titular</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noLoans ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                No hay préstamos para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className='w-36'>{loan.id}</TableCell>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: CONSTANTS.CURRENCY,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(loan.amount)}
                </TableCell>
                <TableCell>
                  {new Date(loan.creationDate).toLocaleDateString('es-ES', {
                    dateStyle: 'medium',
                  })}
                </TableCell>
                <TableCell>
                  <Button>
                    <EditIcon className='mr-2' /> Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </main>
  );
}