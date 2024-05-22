import { CONSTANTS } from '@/config/constants';
import { Payment } from '@/types/entities';
import { PencilIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

import AddPaymentButton from '../../AddPaymentButton';

import useLoan from '@/pages/loan/hooks/useLoan';

interface PaymentPreviewModeProps {
  index: number;
  payment: Payment;
}

export default function PaymentPreviewMode({
  index,
  payment,
}: PaymentPreviewModeProps) {
  const { id } = useParams();
  const { loan } = useLoan({ id: id as string });

  const isFirstPayment = index === 0;

  const paymentAmount = loan!.amount * (payment.percentage / 100);
  const formattedPaymentAmount = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: CONSTANTS.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(paymentAmount);

  const paymentDate = new Date(payment.paymentDate);
  const formattedPaymentDate = paymentDate.toLocaleDateString('es-ES', {
    dateStyle: 'medium',
  });

  const formattedPaymentPercentage = payment.percentage.toLocaleString(
    'es-ES',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  return (
    <Fragment>
      {/* Separator */}
      <div className='absolute top-6 -z-50 w-full border transition-colors group-hover:border-primary'></div>
      {/* Button to add new payments */}
      {isFirstPayment && (
        <AddPaymentButton newPaymentIndex={0} variant='start' />
      )}
      <AddPaymentButton newPaymentIndex={index + 1} variant='end' />
      {/* Payment information */}
      <article className='flex flex-col items-center gap-y-2'>
        <button className='grid aspect-square w-12 place-content-center rounded-full border-2 border-neutral-200 bg-neutral-200  text-primary transition-colors group-hover:border-primary'>
          <PencilIcon
            size={20}
            className='opacity-0 transition-opacity group-hover:opacity-100'
          />
        </button>
        <h2 className='text-xl font-bold'>{payment.title}</h2>
        <span className='font-bold'>
          {formattedPaymentAmount}{' '}
          <span className='font-normal'>({formattedPaymentPercentage} %)</span>
        </span>
        <span>{formattedPaymentDate}</span>
      </article>
    </Fragment>
  );
}