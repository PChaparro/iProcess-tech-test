import { CONSTANTS } from '@/config/constants';
import { PaymentStatus } from '@/types/entities';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

import PaymentContainer from './components/PaymentStepper/PaymentContainer';
import useLoan from './hooks/useLoan';

import { Button } from '@/components/ui/button';

export default function Pagos() {
  const { loan, isEditing, setIsEditing } = useLoan();

  // TODO: Show a loading spinner
  if (!loan) {
    return null;
  }

  const paidPercentage = loan.payments
    .filter((payment) => payment.status === PaymentStatus.PAID)
    .reduce((acc, payment) => acc + payment.percentage, 0);

  const paidAmount = loan.amount * (paidPercentage / 100);

  const remainingAmount = loan.amount - paidAmount;

  return (
    <Fragment>
      <header className='mb-4 flex flex-wrap justify-between gap-4 border-b pb-4'>
        {/* Left part */}
        <button className='inline-flex items-center text-primary'>
          <h1 className='text-2xl font-bold'>Pagos</h1>
          <ChevronDownIcon className='ml-2' />
        </button>
        {/* Right part */}
        <div className='flex items-center gap-x-4'>
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)}>Guardar</Button>
          ) : (
            <Button variant={'ghost'} onClick={() => setIsEditing(true)}>
              Editar
              <PencilIcon className='ml-2' />
            </Button>
          )}
          <p className='text-xl text-neutral-400'>
            Por cobrar{' '}
            <strong className='text-black'>
              {remainingAmount} {CONSTANTS.CURRENCY}
            </strong>
          </p>
        </div>
      </header>
      <main>
        <ul className='flex overflow-x-auto px-24 py-8'>
          {loan.payments.map((payment, idx) => (
            <PaymentContainer key={payment.id} index={idx} payment={payment} />
          ))}
        </ul>
      </main>
    </Fragment>
  );
}
