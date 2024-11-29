'use client';
import type { DBEntityRecord, FormActionType } from '@/app/types/common';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

type SimpleCreateProps<T extends DBEntityRecord> = {
  action: FormActionType<T>;
  title: string;
  triggerButtonText: string;
};

function SimpleCreateDialog<T extends DBEntityRecord>({
  action,
  title,
  triggerButtonText,
}: SimpleCreateProps<T>) {
  const [state, formAction] = useActionState(action, {
    message: '',
  });
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);

  const handleSubmit = (data: FormData) => {
    startTransition(() => formAction(data));
  };

  useEffect(() => {
    if (!isPending && state.message) toast(state.message);
    if (state.data?.id) setIsOpen(false);
  }, [isPending, state.data?.id, state.message]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={openDialog}>
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="py-4">
            <Input name="name" className="col-span-3" required />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SimpleCreateDialog;
