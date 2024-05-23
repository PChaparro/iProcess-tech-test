import { Payment } from '@/types/entities';

import AddPaymentButton from '../../AddPaymentButton';
import { PaymentEditForm } from './PaymentEditForm';

interface PaymentEditModeProps {
  index: number;
  payment: Payment;
}

export default function PaymentEditMode({
  payment,
  index,
}: PaymentEditModeProps) {
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
      {/* Form to edit the payment details */}
      <div className='flex flex-col items-center gap-y-2'>
        <div className='aspect-square w-12 rounded-full border-2 border-primary bg-white'></div>
        <PaymentEditForm
          payment={payment}
          key={`${payment.id}_${payment.percentage}%`}
        />
      </div>
    </div>
  );
}
