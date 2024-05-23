export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
}

export enum PaymentMethod {
  CASH = 'efectivo',
  CARD = 'tarjeta',
}

/**
 * NOTE: Fields ending with `Date` are strings representing dates in the format 'YYYY-MM-DD'.
 */

export type Payment = {
  id: string;
  title: string;
  status: PaymentStatus;
  percentage: number; // Percentage of the total amount
  expectedPaymentDate: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
};

export type Loan = {
  id: string;
  borrower: string; // Name of the person who borrowed the money
  amount: number;
  payments: Payment[];
  creationDate: string;
};
