import { Payment } from '@/types/entities';
import { PencilIcon } from 'lucide-react';

import AddPaymentButton from '../../AddPaymentButton';

import useLoan from '@/pages/loan/hooks/useLoan';
import { formatPaymentInfo } from '@/pages/loan/utils/utils';

interface PaymentPreviewModeProps {
  index: number;
  payment: Payment;
}

export default function PaymentPreviewMode({
  index,
  payment,
}: PaymentPreviewModeProps) {
  const { loan } = useLoan();

  const { amount, percentage, estimatedPaymentDate } = formatPaymentInfo(
    loan!,
    payment,
  );

  const isFirstPayment = index === 0;

  return (
    <div>
      {/* Separator */}
      <div className='absolute top-6 -z-50 w-full border transition-colors group-hover:border-primary'></div>
      {/* Button to add new payments */}
      {isFirstPayment && (
        <AddPaymentButton newPaymentIndex={0} variant='start' />
      )}
      <AddPaymentButton newPaymentIndex={index + 1} variant='end' />
      {/* Payment information */}
      <article className='flex flex-col items-center gap-y-2'>
        <button className='grid aspect-square w-12 place-content-center rounded-full border-2 border-neutral-200 bg-neutral-200  text-primary transition-colors group-hover:border-primary group-hover:bg-white'>
          <PencilIcon
            size={20}
            className='opacity-0 transition-opacity group-hover:opacity-100'
          />
        </button>
        <h2 className='text-xl font-bold'>{payment.title}</h2>
        <span className='font-bold'>
          {amount} <span className='font-normal'>({percentage} %)</span>
        </span>
        <span>{estimatedPaymentDate}</span>
      </article>
    </div>
  );
}
