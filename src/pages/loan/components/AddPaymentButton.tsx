import clsx from 'clsx';
import { PlusIcon } from 'lucide-react';

interface AddPaymentButtonProps {
  newPaymentIndex: number;
  variant?: 'start' | 'end';
}

export default function AddPaymentButton({
  newPaymentIndex,
  variant = 'end',
}: AddPaymentButtonProps) {
  const handleAddPayment = () => {
    console.log('Adding a new payment at index', newPaymentIndex);
  };

  return (
    <div
      className={clsx(
        /* ignore the overflow of the parent */
        'absolute z-10 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100',
        {
          'left-full': variant === 'end',
          'right-full': variant === 'start',
        },
      )}
    >
      <button
        className='grid aspect-square w-10 place-content-center rounded-full bg-neutral-200 text-primary'
        aria-label={`Agregar pago en la posición ${newPaymentIndex}`}
        onClick={handleAddPayment}
      >
        <PlusIcon size={16} />
      </button>
      <p className='absolute left-1/2 w-max -translate-x-1/2 text-neutral-400'>
        Agregar pago
      </p>
    </div>
  );
}
