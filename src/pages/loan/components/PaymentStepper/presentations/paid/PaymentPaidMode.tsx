import { Payment } from '@/types/entities';

import AddPaymentButton from '../../../AddPaymentButton';

import useLoan from '@/pages/loan/hooks/useLoan';
import { formatPaymentInfo } from '@/pages/loan/utils/utils';

interface PaymentPaidModeProps {
  index: number;
  payment: Payment;
}

export default function PaymentPaidMode({
  index,
  payment,
}: PaymentPaidModeProps) {
  const { loan } = useLoan();

  const { amount, percentage, paymentDate } = formatPaymentInfo(loan!, payment);

  const isFirstPayment = index === 0;

  return (
    <div>
      {/* Separator */}
      <div className='absolute top-6 -z-50 w-full border transition-colors group-hover:border-emerald-500'></div>
      {/* Button to add new payments */}
      {isFirstPayment && (
        <AddPaymentButton newPaymentIndex={0} variant='start' />
      )}
      <AddPaymentButton newPaymentIndex={index + 1} variant='end' />
      {/* Payment information */}
      <article className='flex flex-col items-center gap-y-2'>
        <div className='grid aspect-square w-12 place-content-center rounded-full border-2 border-emerald-500  bg-emerald-500 text-primary transition-colors'>
          🎉
        </div>
        <h2 className='text-xl font-bold'>{payment.title}</h2>
        <span className='font-bold'>
          {amount} <span className='font-normal'>({percentage} %)</span>
        </span>
        <p className='text-balance text-emerald-500'>
          Pagado el {paymentDate} con {payment.paymentMethod}
        </p>
      </article>
    </div>
  );
}
