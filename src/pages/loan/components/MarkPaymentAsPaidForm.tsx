import { PaymentMethod } from '@/types/entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useLoan from '../hooks/useLoan';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form validations
const markPaymentAsPaidSchema = z.object({
  method: z.nativeEnum(PaymentMethod, {
    required_error: 'El método de pago es requerido',
    invalid_type_error: 'El método de pago no es válido',
  }),
});

interface MarkPaymentAsPaidFormProps {
  paymentId: string;
  closeDialogCallback: () => void;
}

export default function MarkPaymentAsPaidForm({
  paymentId,
  closeDialogCallback,
}: MarkPaymentAsPaidFormProps) {
  const { markPaymentAsPaid } = useLoan();

  const form = useForm<z.infer<typeof markPaymentAsPaidSchema>>({
    resolver: zodResolver(markPaymentAsPaidSchema),
    defaultValues: {
      method: PaymentMethod.CASH,
    },
  });

  const submitCallback = (values: z.infer<typeof markPaymentAsPaidSchema>) => {
    const { method } = values;
    markPaymentAsPaid(paymentId, method);
    closeDialogCallback();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitCallback)}>
        <FormField
          control={form.control}
          name='method'
          render={({ field }) => (
            <FormItem className='mb-4 items-center gap-x-4'>
              <FormLabel>Método de pago</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className='max-w-48'>
                    <SelectValue placeholder='Selecciona un método de pago' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.CASH}>Efectivo</SelectItem>
                    <SelectItem value={PaymentMethod.CARD}>Tarjeta</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {form.formState.errors.method && (
                <FormMessage>
                  {form.formState.errors.method.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        ></FormField>
        <DialogFooter>
          <Button
            type='button'
            variant={'ghost'}
            size={'icon'}
            aria-label='Descartar pago'
            onClick={closeDialogCallback}
            className='text-neutral-300'
          >
            <Trash2Icon />
          </Button>
          <Button type='submit'>Guardar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
