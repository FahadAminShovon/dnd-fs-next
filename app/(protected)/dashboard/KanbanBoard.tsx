'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import {
  type DataRef,
  DndContext,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import Column from './Column';
import { Item } from './Item';
import type { TaskType } from './schema';

type KanbanBoardProps = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
};

const KanbanBoard = ({ tasks: initialTasks, allStatus }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    const activeTask = event.active.data as DataRef<TaskType>;
    if (activeTask.current) {
      setActiveTask(activeTask.current);
    }
  };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <div className="flex gap-4 *:flex-1">
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {allStatus.map((status) => {
          const statusTasks = tasks.filter(
            (task) => task.status.id === status.id,
          );
          return <Column key={status.id} status={status} tasks={statusTasks} />;
        })}
        <DragOverlay>{activeTask && <Item item={activeTask} />}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
