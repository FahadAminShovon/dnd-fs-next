'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import Column from './Column';
import type { TaskType } from './schema';

type KanbanBoardProps = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
};

const KanbanBoard = ({ tasks, allStatus }: KanbanBoardProps) => {
  return (
    <div className="flex gap-4 *:flex-1">
      {allStatus.map((status) => {
        const statusTasks = tasks.filter(
          (task) => task.status.id === status.id,
        );
        return <Column key={status.id} status={status} tasks={statusTasks} />;
      })}
    </div>
  );
};

export default KanbanBoard;
