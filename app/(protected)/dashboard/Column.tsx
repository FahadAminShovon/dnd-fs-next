import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { SortableItem } from './Item';
import type { TaskType } from './schema';

type ColumnProps = {
  status: StatusSelectSchemaType;
  tasks: TaskType[];
};

const Column = ({ status, tasks }: ColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: `col-${status.id}`,
  });
  const tasksIds = useMemo(
    () => tasks.map((task) => `task-${task.id}`),
    [tasks],
  );
  return (
    <div className="p-4 border max-w-sm">
      <h2 className="mb-2">{status.name}</h2>
      <hr className="mb-4" />
      <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2" ref={setNodeRef}>
          {tasks.map((task) => (
            <li key={task.id}>
              <SortableItem key={task.id} item={task} />
            </li>
          ))}
        </ol>
      </SortableContext>
    </div>
  );
};

export default Column;
