import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import type { TaskType } from '../schema';
import { SortableItem } from './task-item';

type ColumnProps = {
  status: StatusSelectSchemaType;
  tasks: TaskType[];
};

const Column = ({ status, tasks }: ColumnProps) => {
  const { setNodeRef } = useSortable({
    id: `col-${status.id}`,
  });
  const tasksIds = useMemo(
    () => tasks.map((task) => `task-${task.id}`),
    [tasks],
  );
  return (
    <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
      <Card
        ref={setNodeRef}
        className="w-full sm:w-[300px] flex-shrink-0 shadow-none border border-border bg-background/50 rounded-md"
      >
        <CardHeader className="pb-2">
          <CardTitle>{status.name}</CardTitle>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="pt-0 px-2">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks</p>
          ) : (
            <ol className="space-y-2">
              {tasks.map((task) => (
                <Button
                  asChild
                  key={task.id}
                  onClick={() => {
                    console.log('clicked');
                  }}
                  className="p-0"
                  variant={'ghost'}
                >
                  <li className="h-full w-full">
                    <SortableItem key={task.id} item={task} />
                  </li>
                </Button>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </SortableContext>
  );
};

export default Column;
