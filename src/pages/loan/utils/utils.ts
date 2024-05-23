import { CONSTANTS } from '@/config/constants';
import { Loan, Payment } from '@/types/entities';

export function isPaymentPercentageValid(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}

interface FormattedPaymentInfo {
  amount: string;
  percentage: string;
  estimatedPaymentDate: string;
  paymentDate?: string;
}

export function formatPaymentInfo(
  loan: Loan,
  payment: Payment,
): FormattedPaymentInfo {
  const paymentAmount = loan.amount * (payment.percentage / 100);
  const formattedPaymentAmount = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: CONSTANTS.CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(paymentAmount);

  const formattedPaymentPercentage = payment.percentage.toLocaleString(
    'es-ES',
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  );

  const estimatedPaymentDate = new Date(
    payment.expectedPaymentDate.replace(/-/g, '/'),
  );
  const formattedEstimatedPaymentDate = estimatedPaymentDate.toLocaleDateString(
    'es-ES',
    {
      dateStyle: 'medium',
    },
  );

  const paymentDate = payment.paymentDate
    ? new Date(payment.paymentDate.replace(/-/g, '/'))
    : null;
  const formattedPaymentDate = paymentDate?.toLocaleDateString('es-ES', {
    dateStyle: 'medium',
  });

  return {
    amount: formattedPaymentAmount,
    percentage: formattedPaymentPercentage,
    estimatedPaymentDate: formattedEstimatedPaymentDate,
    paymentDate: formattedPaymentDate,
  };
}
