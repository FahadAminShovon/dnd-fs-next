'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import type { TagsSelectSchemaType } from '@/db/schema/tags';
import { useState } from 'react';
import { Task } from './Task';
import UpdateTaskDialog from './TaskUpdate';
import TaskView from './TaskView';
import { KanbanBoard } from './_components';
import type { TaskType } from './tasks.schema';

type PropType = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
  tagsAsync: Promise<TagsSelectSchemaType[]>;
};

const TasksList = ({ tasks, allStatus, tagsAsync }: PropType) => {
  const [selectedEditTask, setSelectedEditTask] = useState<TaskType | null>(
    null,
  );

  const [selectedViewTask, setSelectedViewTask] = useState<TaskType | null>(
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
      {selectedViewTask && (
        <TaskView
          task={selectedViewTask}
          onClose={() => setSelectedViewTask(null)}
          allStatus={allStatus}
          onEdit={(task) => {
            setSelectedViewTask(null);
            setSelectedEditTask(task);
          }}
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
              onClick={(task) => {
                setSelectedViewTask(task);
              }}
            />
          );
        }}
      />
    </>
  );
};

export default TasksList;
