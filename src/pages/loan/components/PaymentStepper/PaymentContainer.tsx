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

  return (
    <li className='group relative flex-[0_0_25%]'>
      {isEditing ? (
        <PaymentEditMode />
      ) : (
        <PaymentPreviewMode index={index} payment={payment} />
      )}
    </li>
  );
}
