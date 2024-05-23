import {
  formatDateToYYYYMMDD,
  getRandomLoanId,
  getRandomPaymentId,
} from '@/lib/utils';
import { Loan, Payment, PaymentStatus } from '@/types/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import useToast from '@/hooks/useToast';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Form validations
const createLoanSchema = z.object({
  borrower: z
    .string()
    .min(1, 'El nombre del titular es requerido')
    .max(64, 'El nombre del titular no puede exceder los 64 caracteres'),
  amount: z
    .number({ coerce: true })
    .min(1, 'El valor del préstamo debe ser mayor a 0'),
});

interface createLoanFormProps {
  closeDialogCallback: () => void;
  addLoanCallback: (loan: Loan) => void;
}

export const CreateLoanForm = ({
  closeDialogCallback,
  addLoanCallback,
}: createLoanFormProps) => {
  const { showSuccessToast } = useToast();

  // Form state
  const form = useForm<z.infer<typeof createLoanSchema>>({
    resolver: zodResolver(createLoanSchema),
    defaultValues: {
      borrower: '',
      amount: 0,
    },
  });

  const submitCallback = (values: z.infer<typeof createLoanSchema>) => {
    const { borrower, amount } = values;

    const oneMothFromNow = new Date();
    oneMothFromNow.setMonth(oneMothFromNow.getMonth() + 1);

    const defaultPayment: Payment = {
      id: getRandomPaymentId(),
      title: 'Anticipo',
      percentage: 100,
      status: PaymentStatus.PENDING,
      expectedPaymentDate: formatDateToYYYYMMDD(oneMothFromNow),
    };

    const now = new Date();

    const loan: Loan = {
      amount,
      borrower,
      id: getRandomLoanId(),
      creationDate: formatDateToYYYYMMDD(now),
      payments: [defaultPayment],
    };

    /** TODO: In a real scenario, the callback should make a request to an API to create the loan
     * and we should handle any error that may occur to show a success or error toast.
     */
    addLoanCallback(loan);
    showSuccessToast('Préstamo creado correctamente');
    closeDialogCallback();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitCallback)}>
        <FormField
          control={form.control}
          name='borrower'
          render={({ field }) => (
            <FormItem className='mb-4 grid grid-cols-4 items-center gap-x-4'>
              <FormLabel>Titular</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ingrese el nombre del titular'
                  className='col-span-3'
                  {...field}
                />
              </FormControl>
              {form.formState.errors.borrower && (
                <FormMessage className='col-span-3 col-start-2'>
                  {form.formState.errors.borrower.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem className='mb-4 grid grid-cols-4 items-center gap-x-4'>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ingrese el valor del préstamo'
                  className='col-span-3'
                  type='number'
                  step='0.01'
                  {...field}
                />
              </FormControl>
              {form.formState.errors.amount && (
                <FormMessage className='col-span-3 col-start-2'>
                  {form.formState.errors.amount.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <DialogFooter>
          <Button type='submit'>Crear</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
