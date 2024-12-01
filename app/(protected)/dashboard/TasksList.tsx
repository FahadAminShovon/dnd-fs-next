'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import type { TagsSelectSchemaType } from '@/db/schema/tags';
import { useState } from 'react';
import { KanbanBoard } from './Kanban';
import { Task } from './Task';
import UpdateTaskDialog from './UpdateTask';
import type { TaskType } from './schema';

type PropType = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
  tagsAsync: Promise<TagsSelectSchemaType[]>;
};

const TasksList = ({ tasks, allStatus, tagsAsync }: PropType) => {
  const [selectedEditTask, setSelectedEditTask] = useState<TaskType | null>(
    null,
  );
  return (
    <>
      {selectedEditTask && (
        <UpdateTaskDialog
          task={selectedEditTask}
          tagsAsync={tagsAsync}
          statuses={allStatus}
          onClose={() => setSelectedEditTask(null)}
        />
      )}
      <KanbanBoard
        tasks={tasks}
        allStatus={allStatus}
        renderItem={({ ...props }) => {
          return (
            <Task
              {...props}
              onEdit={(task) => {
                setSelectedEditTask(task);
              }}
            />
          );
        }}
      />
    </>
  );
};

export default TasksList;
