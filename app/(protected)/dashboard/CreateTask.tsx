'use client';
import { Button } from '@/components/ui/button';
import {} from '@/components/ui/dialog';
import {} from '@/components/ui/form';
import {} from '@/components/ui/select';
import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import type { TagsSelectSchemaType } from '@/db/schema/tags';
import { tasksInsertSchema } from '@/db/schema/tasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useActionState, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import TaskCreateUpdateForm from './TaskCreateUpdateForm';
import { taskCreateAction } from './action';

export const formSchema = tasksInsertSchema.omit({ userId: true });

type CreateTaskProps = {
  tagsAsync: Promise<TagsSelectSchemaType[]>;
  statuses: StatusSelectSchemaType[];
};
export default function CreateTaskDialog({
  tagsAsync,
  statuses,
}: CreateTaskProps) {
  const allTags = use(tagsAsync);
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useActionState(taskCreateAction, {
    message: '',
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.data?.id && !isPending && state.message) {
      setIsOpen(false);
      toast.success(state.message);
      return;
    }
    if (!isPending && state.message) {
      toast.error(state.message);
    }
  }, [state.data?.id, isPending, state.message]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      statusId: statuses?.[0]?.id ?? Number.NaN,
      tags: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description ?? '');
    formData.append('statusId', values.statusId.toString());
    formData.append('tags', JSON.stringify(values.tags));
    startTransition(() => formAction(formData));
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Task</Button>
      <TaskCreateUpdateForm
        form={form}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
        statuses={statuses}
        allTags={allTags}
        title="Create New Task"
        details="Fill in the details for your new task. Click save when you're done."
        saveButtonLabel="Create Task"
      />
    </>
  );
}
