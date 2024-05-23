import { type ClassValue, clsx } from 'clsx';
import { customAlphabet } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomId(length = 4): string {
  const generateNanoId = customAlphabet('1234567890', length);
  return generateNanoId();
}

export function getRandomLoanId(): string {
  return `LOAN${getRandomId()}`;
}

export function getRandomPaymentId(): string {
  return `PAY${getRandomId()}`;
}

export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isPaymentPercentageValid(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}
