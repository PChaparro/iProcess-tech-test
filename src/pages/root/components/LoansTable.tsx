import { CONSTANTS } from '@/config/constants';
import { Loan } from '@/types/entities';
import { EditIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LoansTableProps {
  loans: Loan[];
}

export default function LoansTable({ loans }: LoansTableProps) {
  const noLoans = loans.length === 0;

  return (
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
                <Link
                  to={`/loan/${loan.id}`}
                  className={buttonVariants({ variant: 'default' })}
                >
                  Editar
                  <EditIcon className='ml-2' />
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
