'use client';
import {} from '@/components/ui/dialog';
import {} from '@/components/ui/form';
import {} from '@/components/ui/select';
import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import type { TagsSelectSchemaType } from '@/db/schema/tags';
import { taskUpdateSchema, tasksInsertSchema } from '@/db/schema/tasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useActionState, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import TaskCreateUpdateForm from './TaskCreateUpdateForm';
import { taskUpdateAction } from './action';
import type { TaskType } from './tasks.schema';

export const formSchema = tasksInsertSchema.omit({ userId: true });

type CreateTaskProps = {
  tagsAsync: Promise<TagsSelectSchemaType[]>;
  statuses: StatusSelectSchemaType[];
  task: TaskType;
  onClose: () => void;
};
export default function UpdateTaskDialog({
  tagsAsync,
  statuses,
  onClose,
  task,
}: CreateTaskProps) {
  const allTags = use(tagsAsync);
  const [isOpen, setIsOpen] = useState(true);

  const [state, formAction] = useActionState(taskUpdateAction, {
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
      onClose();
    }
  }, [isOpen, onClose]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      statusId: task.statusId,
      tags: task.tasksToTags.map((tag) => tag.tag),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description ?? '');
    formData.append('statusId', values.statusId.toString());
    formData.append('tags', JSON.stringify(values.tags));
    formData.append('id', task.id.toString());

    const formEntries = Object.fromEntries(formData.entries());
    const parsed = taskUpdateSchema.safeParse({ ...formEntries, id: +task.id });

    console.log('parsed', formEntries, parsed);

    startTransition(() => formAction(formData));
  }

  return (
    <TaskCreateUpdateForm
      form={form}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={onSubmit}
      statuses={statuses}
      allTags={allTags}
      title="Update Task"
      details="Fill in the details for your new task. Click save when you're done."
      saveButtonLabel="Update Task"
    />
  );
}
