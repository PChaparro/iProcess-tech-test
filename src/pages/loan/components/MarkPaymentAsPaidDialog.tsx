import { PencilIcon } from 'lucide-react';
import { useState } from 'react';

import MarkPaymentAsPaidForm from './MarkPaymentAsPaidForm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MarkPaymentAsPaidDialogProps {
  paymentId: string;
}

export default function MarkPaymentAsPaidDialog({
  paymentId,
}: MarkPaymentAsPaidDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          aria-label='Marcar como pagado'
          className='grid aspect-square w-12 place-content-center rounded-full border-2 border-neutral-200 bg-neutral-200  text-primary transition-colors group-hover:border-primary group-hover:bg-white'
        >
          <PencilIcon
            size={20}
            className='opacity-0 transition-opacity group-hover:opacity-100'
          />
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Pagar</DialogTitle>
          <DialogDescription>Selecciona el método de pago.</DialogDescription>
        </DialogHeader>
        <MarkPaymentAsPaidForm
          paymentId={paymentId}
          closeDialogCallback={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
