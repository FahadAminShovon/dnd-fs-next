'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import {
  type DataRef,
  DndContext,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
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
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    const activeTask = event.active.data as DataRef<TaskType>;
    if (activeTask.current) {
      setActiveTask(activeTask.current);
    }
  };

  // const onDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   if (!active || !over) return;

  //   const activeTask = active.data as DataRef<TaskType>;
  //   if (!activeTask.current) return;

  //   const taskId = activeTask.current.id;
  //   const taskStatusId = activeTask.current.status.id;

  //   const overType = over.id.toString().split('-')[0] as 'task' | 'col';

  //   let statusIdUpdate = Number.NaN;

  //   if (overType === 'col') {
  //     statusIdUpdate = Number(over.id.toString().split('-')[1]);
  //   } else {
  //     const overTask = over.data as DataRef<TaskType>;
  //     if (overTask.current) {
  //       statusIdUpdate = overTask.current.status.id;
  //     }
  //   }

  //   if (Number.isNaN(statusIdUpdate)) return;
  //   const updatedStatus = allStatus.find(
  //     (status) => status.id === statusIdUpdate,
  //   );
  //   if (!updatedStatus) return;

  //   console.log('tasks', statusIdUpdate, taskStatusId);

  //   if (statusIdUpdate === taskStatusId) return;

  //   // only update if the status is different
  //   const updatedTasks = tasks.map((task) => {
  //     if (task.id === taskId) {
  //       return {
  //         ...task,
  //         status: {
  //           id: updatedStatus.id,
  //           name: updatedStatus.name,
  //         },
  //       };
  //     }
  //     return task;
  //   });

  //   setTasks(updatedTasks);
  // };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <div className="flex gap-4 *:flex-1">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        // onDragOver={onDragOver}
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
