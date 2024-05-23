import { Payment } from '@/types/entities';

import useLoan from '../../hooks/useLoan';
import PaymentEditMode from './presentations/edit/PaymentEditMode';
import PaymentPaidMode from './presentations/paid/PaymentPaidMode';
import PaymentPreviewMode from './presentations/preview/PaymentPreviewMode';

interface PaymentContainerProps {
  index: number;
  payment: Payment;
}

export default function PaymentContainer({
  index,
  payment,
}: PaymentContainerProps) {
  const { paymentDate, paymentMethod } = payment;
  const { isEditing } = useLoan();

  const wasPaid = Boolean(paymentDate) && Boolean(paymentMethod);
  let paymentPresentation: JSX.Element;

  if (wasPaid) {
    paymentPresentation = <PaymentPaidMode index={index} payment={payment} />;
  } else if (isEditing) {
    paymentPresentation = <PaymentEditMode index={index} payment={payment} />;
  } else {
    paymentPresentation = (
      <PaymentPreviewMode index={index} payment={payment} />
    );
  }

  return (
    <li className='group relative min-w-64 flex-[0_0_25%]'>
      {paymentPresentation}
    </li>
  );
}
