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
