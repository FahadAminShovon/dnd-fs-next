'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import { useState } from 'react';
import { KanbanBoard } from './Kanban';
import { Task } from './Task';
import type { TaskType } from './schema';

type PropType = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
};

const TasksList = ({ tasks, allStatus }: PropType) => {
  const [selectedEditTask, setSelectedEditTask] = useState<TaskType | null>(
    null,
  );
  return (
    <>
      {selectedEditTask &&
        // <TaskCreateAndUpdate type="update" task={selectedEditTask} />
        null}
      <KanbanBoard
        tasks={tasks}
        allStatus={allStatus}
        renderItem={({ ...props }) => {
          return <Task {...props} onEdit={setSelectedEditTask} />;
        }}
      />
    </>
  );
};

export default TasksList;
