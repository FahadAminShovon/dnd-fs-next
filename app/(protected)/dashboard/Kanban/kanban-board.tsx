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
import debounce from 'lodash.debounce';
import {} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { toast } from 'sonner';
import { rearrangeTasksAction } from '../action';
import { type TaskType, tasksListSchema } from '../tasks.schema';
import Column from './container';
import type { RenderKanbanItemType } from './kanban.types';

type KanbanBoardProps = {
  tasks: TaskType[];
  allStatus: StatusSelectSchemaType[];
  renderItem: RenderKanbanItemType;
};

const tasksDeepCopy = (tasks: TaskType[]) => {
  const jsonParsedTasks = JSON.parse(JSON.stringify(tasks));
  const parsedTasks = tasksListSchema.safeParse(jsonParsedTasks);
  if (parsedTasks.success) {
    return parsedTasks.data;
  }
  toast.error('Error parsing tasks');
  return [];
};

const KanbanBoard = ({
  tasks: initialTasks,
  allStatus,
  renderItem,
}: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<TaskType[]>(() => {
    return tasksDeepCopy(initialTasks);
  });
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [_isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // Debounced function to update the tasks
  // when hovering over multiple tasks at once the onDragOver function is called multiple times
  const debouncedSetTasks = useMemo(() => debounce(setTasks, 50), []);

  useEffect(() => {
    setTasks(tasksDeepCopy(initialTasks));
  }, [initialTasks]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {}),
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

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isOverATask = overId.toString().startsWith('task');

      const activeTaskId = Number.parseInt(
        activeId.toString().split('-')[1],
        10,
      );

      if (Number.isNaN(activeTaskId)) return;

      // putting task over another task
      if (isOverATask) {
        debouncedSetTasks((tasks) => {
          const overTaskId = Number.parseInt(
            overId.toString().split('-')[1],
            10,
          );

          const activeIndex = tasks.findIndex(
            (task) => task.id === activeTaskId,
          );
          const activeTask = tasks[activeIndex];

          const overIndex = tasks.findIndex((task) => task.id === overTaskId);
          const overTask = tasks[overIndex];

          if (
            activeTask &&
            overTask &&
            activeTask.statusId !== overTask.statusId
          ) {
            activeTask.statusId = overTask.statusId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }

          return arrayMove(tasks, activeIndex, overIndex);
        });
        return;
      }

      // putting task over a column
      const columnId = Number.parseInt(overId.toString().split('-')[1], 10);
      if (Number.isNaN(columnId)) return;
      debouncedSetTasks((tasks) => {
        const activeTask = tasks.find((task) => task.id === activeTaskId);
        if (activeTask) {
          activeTask.statusId = columnId;
          return [...tasks];
        }

        return tasks;
      });
    },
    [debouncedSetTasks],
  );

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;
    const activeId = Number.parseInt(active.id.toString().split('-')[1], 10);
    if (Number.isNaN(activeId)) return;

    const activeIndexInInitialTasks = initialTasks.findIndex(
      (task) => task.id === activeId,
    );
    const activeStatusInInitialTasks =
      initialTasks[activeIndexInInitialTasks].statusId;

    const activeIndexInTasks = tasks.findIndex((task) => task.id === activeId);
    const activeStatusInTasks = tasks[activeIndexInTasks].statusId;

    if (
      activeIndexInInitialTasks === activeIndexInTasks &&
      activeStatusInInitialTasks === activeStatusInTasks
    ) {
      return;
    }

    startTransition(() => {
      rearrangeTasksAction({
        tasks: tasks,
      });
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4  overflow-x-auto">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
        collisionDetection={closestCorners}
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {allStatus.map((status) => {
            const statusTasks = tasks.filter(
              (task) => task.statusId === status.id,
            );
            return (
              <Column
                key={status.id}
                status={status}
                tasks={statusTasks}
                renderItem={renderItem}
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeTask && (
            <div className="transform scale-105 transition-transform">
              {renderItem({
                item: activeTask,
                isHoverDisabled: true,
                isDragging: true,
              })}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export { KanbanBoard };
