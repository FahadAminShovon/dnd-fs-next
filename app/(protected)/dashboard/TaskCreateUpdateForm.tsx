import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import type { TagsSelectSchemaType } from '@/db/schema/tags';
import { X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import type { formSchema } from './CreateTask';

type FormSchemaType = z.infer<typeof formSchema>;

type TaskCreateUpdateFormProps = {
  form: UseFormReturn<FormSchemaType>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: FormSchemaType) => void;
  statuses: StatusSelectSchemaType[];
  allTags: TagsSelectSchemaType[];
  title: string;
  details?: React.ReactNode;
  saveButtonLabel: string;
};

const TaskCreateUpdateForm = ({
  form,
  isOpen,
  setIsOpen,
  onSubmit,
  statuses,
  allTags,
  title,
  details,
  saveButtonLabel,
}: TaskCreateUpdateFormProps) => {
  const handleAddTag = (tagId: string) => {
    const tag = allTags.find((t) => t.id.toString() === tagId);
    if (tag && !form.getValues('tags').some((t) => t.id === tag.id)) {
      form.setValue('tags', [...form.getValues('tags'), tag]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    form.setValue(
      'tags',
      form.getValues('tags').filter((tag) => tag.id !== tagId),
    );
  };

  const availableTags = allTags.filter(
    (tag) => !form.getValues('tags').some((t) => t.id === tag.id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {details && <DialogDescription>{details}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormDescription>The title of your task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="statusId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id.toString()}
                        >
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The current status of the task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Select onValueChange={handleAddTag}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add tags" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2">
                        {form.watch('tags').map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveTag(tag.id)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">
                                Remove {tag.name} tag
                              </span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to your task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={Number.isNaN(form.watch('statusId'))}
              >
                {saveButtonLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateUpdateForm;
