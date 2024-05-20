import { Loan } from '@/types/entities';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { CreateLoanForm } from './CreateLoanForm';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateLoanDialogProps {
  addLoanCallback: (loan: Loan) => void;
}

export default function CreateLoanDialog({
  addLoanCallback,
}: CreateLoanDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Nuevo préstamo
          <PlusIcon className='ml-2' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Crear nuevo préstamo</DialogTitle>
          <DialogDescription>
            Ingrese los datos del préstamo a continuación. Haga clic en "Crear"
            para guardar el préstamo.
          </DialogDescription>
        </DialogHeader>
        <CreateLoanForm
          closeDialogCallback={() => setIsOpen(false)}
          addLoanCallback={addLoanCallback}
        />
      </DialogContent>
    </Dialog>
  );
}
