'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import {
  type DataRef,
  DndContext,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const activeTask = event.active.data as DataRef<TaskType>;
    if (activeTask.current) {
      setActiveTask(activeTask.current);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    console.log('event', event);
  };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <div className="flex gap-4 *:flex-1">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        collisionDetection={closestCorners}
        sensors={sensors}
      >
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
