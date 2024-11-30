'use client';

import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useTransition } from 'react';
import Column from './Column';
import { Item } from './Item';
import { updateTasksAction } from './action';
import type { TaskType } from './schema';

type KanbanBoardProps = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
};

const KanbanBoard = ({ tasks: initialTasks, allStatus }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [_isPending, startTransition] = useTransition();

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
    const activeTaskId = Number.parseInt(
      event.active.id.toString().split('-')[1],
    );
    const activeTask = tasks.find((task) => task.id === activeTaskId);
    if (!activeTask) return;
    setActiveTask(activeTask);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isOverATask = overId.toString().startsWith('task');

    const activeTaskId = Number.parseInt(activeId.toString().split('-')[1], 10);
    if (Number.isNaN(activeTaskId)) return;

    // putting task over another task
    if (isOverATask) {
      setTasks((tasks) => {
        const overTaskId = Number.parseInt(overId.toString().split('-')[1], 10);

        const activeIndex = tasks.findIndex((task) => task.id === activeTaskId);
        const activeTask = tasks[activeIndex];

        const overIndex = tasks.findIndex((task) => task.id === overTaskId);
        const overTask = tasks[overIndex];

        if (
          activeTask &&
          overTask &&
          activeTask.status.id !== overTask.status.id
        ) {
          activeTask.status.id = overTask.status.id;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
      return;
    }

    // putting task over a column
    const columnId = Number.parseInt(overId.toString().split('-')[1], 10);
    if (Number.isNaN(columnId)) return;
    setTasks((tasks) => {
      const activeTask = tasks.find((task) => task.id === activeTaskId);
      if (activeTask) {
        activeTask.status.id = columnId;
        return [...tasks];
      }

      return tasks;
    });
  };

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

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;
    const activeId = Number.parseInt(active.id.toString().split('-')[1], 10);
    if (Number.isNaN(activeId)) return;

    const activeIndexInInitialTasks = initialTasks.findIndex(
      (task) => task.id === activeId,
    );
    const activeIndexInTasks = tasks.findIndex((task) => task.id === activeId);

    if (activeIndexInInitialTasks === activeIndexInTasks) return;

    startTransition(() => {
      updateTasksAction({
        tasks: tasks,
      });
    });
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
