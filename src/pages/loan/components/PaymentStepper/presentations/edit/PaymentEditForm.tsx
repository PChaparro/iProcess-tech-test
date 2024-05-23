import { CONSTANTS } from '@/config/constants';
import { Payment } from '@/types/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useLoan from '@/pages/loan/hooks/useLoan';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const paymentSchema = z.object({
  title: z.string().trim().min(1, 'El título del pago es requerido'),
  amount: z.number().readonly(),
  percentage: z
    .number({ coerce: true })
    .min(0.01, 'El porcentaje del pago debe ser mayor a 0.01')
    .max(100, 'El porcentaje del pago no puede ser mayor a 100'),
  expectedPaymentDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'La fecha de pago debe tener el formato YYYY-MM-DD',
    )
    .refine(
      (value) => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const expectedPaymentDate = new Date(
          value.replace(/-/g, '/'),
        ).getTime();

        return expectedPaymentDate >= currentDate;
      },
      { message: 'La fecha del pago debe ser mayor o igual a la fecha actual' },
    ),
});

interface PaymentEditFormProps {
  payment: Payment;
}

export const PaymentEditForm = ({ payment }: PaymentEditFormProps) => {
  const { loan, updatePaymentPercentage, updatePaymentInfo } = useLoan();
  const paymentAmount = loan!.amount * (payment.percentage / 100);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      title: payment.title,
      amount: paymentAmount,
      percentage: payment.percentage,
      expectedPaymentDate: payment.expectedPaymentDate,
    },
  });

  // Helpers
  const addToPercentage = (value: number) => {
    const currentPercentage = form.getValues('percentage');
    const newPercentage = currentPercentage + value;
    form.setValue('percentage', newPercentage);
  };

  const formUpdateCallback = (values: z.infer<typeof paymentSchema>) => {
    const percentageHasChanged = values.percentage !== payment.percentage;
    if (percentageHasChanged) {
      updatePaymentPercentage(payment.id, values.percentage);
    }

    const paymentInfoHasChanged =
      values.title !== payment.title ||
      values.expectedPaymentDate !== payment.expectedPaymentDate;

    if (paymentInfoHasChanged) {
      const updatedPayment: Payment = {
        ...payment,
        title: values.title,
        expectedPaymentDate: values.expectedPaymentDate,
      };

      updatePaymentInfo(updatedPayment);
    }
  };

  return (
    <Form {...form}>
      <form
        className='px-12'
        onSubmit={form.handleSubmit(formUpdateCallback)}
        onChange={form.handleSubmit(formUpdateCallback)}
      >
        {/* Payment title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormControl>
                <Input
                  placeholder='Ingrese el título del pago'
                  aria-label='Título del pago'
                  {...field}
                />
              </FormControl>
              {form.formState.errors.title && (
                <FormMessage>{form.formState.errors.title.message}</FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        {/* Payment amount */}
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder='Ingrese el valor del pago'
                    aria-label='Valor del pago'
                    type='number'
                    readOnly
                    {...field}
                  />
                  <span className='absolute right-10 top-1/2 -translate-y-1/2 text-neutral-400'>
                    {CONSTANTS.CURRENCY}
                  </span>
                </div>
              </FormControl>
              {form.formState.errors.amount && (
                <FormMessage>
                  {form.formState.errors.amount.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        {/* Payment percentage */}
        <FormField
          control={form.control}
          name='percentage'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormControl>
                <div className='flex gap-x-2'>
                  <Button
                    size={'icon'}
                    variant={'secondary'}
                    className='aspect-square rounded-full'
                    onClick={() => addToPercentage(-1)}
                  >
                    <MinusIcon />
                  </Button>
                  <Input
                    className='border-none'
                    placeholder='Ingrese el porcentaje del pago'
                    aria-label='Porcentaje del pago'
                    type='number'
                    step={0.01}
                    {...field}
                  />
                  <Button
                    size={'icon'}
                    variant={'secondary'}
                    className='aspect-square rounded-full'
                    onClick={() => addToPercentage(1)}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </FormControl>
              {form.formState.errors.percentage && (
                <FormMessage>
                  {form.formState.errors.percentage.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        {/* Payment date */}
        <FormField
          control={form.control}
          name='expectedPaymentDate'
          render={({ field }) => (
            <FormItem className='mb-4'>
              <FormLabel className='text-neutral-400'>Vence</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ingrese la fecha del pago'
                  type='date'
                  step={0.01}
                  {...field}
                />
              </FormControl>
              {form.formState.errors.expectedPaymentDate && (
                <FormMessage>
                  {form.formState.errors.expectedPaymentDate.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
      </form>
    </Form>
  );
};
