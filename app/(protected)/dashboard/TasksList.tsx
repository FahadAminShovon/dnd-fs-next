'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import { KanbanBoard } from './Kanban';
import { Task } from './Task';
import type { TaskType } from './schema';

type PropType = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
};

const TasksList = ({ tasks, allStatus }: PropType) => {
  return <KanbanBoard tasks={tasks} allStatus={allStatus} renderItem={Task} />;
};

export default TasksList;
