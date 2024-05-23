import { Payment } from '@/types/entities';

import useLoan from '../../hooks/useLoan';
import PaymentEditMode from './presentations/PaymentEditMode';
import PaymentPreviewMode from './presentations/PaymentPreviewMode';

interface PaymentContainerProps {
  index: number;
  payment: Payment;
}

export default function PaymentContainer({
  index,
  payment,
}: PaymentContainerProps) {
  const { isEditing } = useLoan();

  const paymentPresentation = isEditing ? (
    <PaymentEditMode index={index} payment={payment} />
  ) : (
    <PaymentPreviewMode index={index} payment={payment} />
  );

  return (
    <li className='group relative min-w-64 flex-[0_0_25%]'>
      {paymentPresentation}
    </li>
  );
}
