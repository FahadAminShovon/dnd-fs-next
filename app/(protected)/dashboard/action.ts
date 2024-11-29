'use server';

import { requireUser } from '@/app/(auth)/actions';
import type { ActionFormState } from '@/app/types/common';
import { db } from '@/db';
import { tasksToTags } from '@/db/schema';
import tasks, {
  type TasksSelectSchemaType,
  tasksInsertSchema,
} from '@/db/schema/tasks';
import { revalidateTag, unstable_cache } from 'next/cache';
import { tasksListSchema } from './schema';

type TaskCreateStateType = ActionFormState<TasksSelectSchemaType>;

async function taskCreateAction(
  _: TaskCreateStateType,
  formData: FormData,
): Promise<TaskCreateStateType> {
  const data = Object.fromEntries(formData.entries());
  const tags = data.tags;
  data.tags = [] as any;

  if (tags && typeof tags === 'string') {
    data.tags = JSON.parse(tags);
  }

  const userId = (await requireUser()).id;

  const parsed = tasksInsertSchema.safeParse({ ...data, userId });

  if (parsed.success) {
    // Here you would typically send the data to your backend
    try {
      const newTaskEntry = await db.transaction(async (tx) => {
        const [lastTaskOfStatus] = await tx.query.tasks.findMany({
          where(fields, operators) {
            return operators.eq(fields.statusId, parsed.data.statusId);
          },
          orderBy(fields, operators) {
            return operators.desc(fields.orderIndex);
          },
        });
        const orderIndex = lastTaskOfStatus
          ? lastTaskOfStatus.orderIndex + 1
          : 0;
        const [newTask] = await tx
          .insert(tasks)
          .values({ ...parsed.data, orderIndex, userId })
          .returning();

        if (parsed.data.tags.length > 0) {
          await tx.insert(tasksToTags).values(
            parsed.data.tags.map((tag) => ({
              taskId: newTask.id,
              tagId: tag.id,
            })),
          );
        }
        return newTask;
      });

      revalidateTag('tasks-list');
      return {
        message: 'Task created successfully',
        data: newTaskEntry,
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          message: e.message,
          issues: [e.message],
        };
      }
      return {
        message: 'Bad request',
        issues: ['Invalid data'],
      };
    }
  }
  return {
    message: 'Invalid data',
    issues: parsed.error.issues.map((issue) => issue.message),
  };
}

const getTasksAction = unstable_cache(
  async ({ userId: id }: { userId: number }) => {
    const tasks = await db.query.tasks.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, id);
      },
      columns: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
      },
      with: {
        tasksToTags: {
          columns: {
            taskId: false,
            tagId: false,
          },
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
          extra: {
            taskId: true,
          },
        },
        status: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    const parsedTasks = tasksListSchema.safeParse(tasks);

    if (!parsedTasks.success) {
      throw new Error(
        parsedTasks.error.issues.map((issue) => issue.message).join(', '),
      );
    }

    return parsedTasks.data;
  },
  ['tasks', 'tasks-list'],
  {
    tags: ['tasks-list'],
  },
);

async function getTasksActionWrapper() {
  const user = await requireUser();
  const tasks = getTasksAction({ userId: user.id });
  return tasks;
}

export { taskCreateAction, getTasksActionWrapper as getTasksAction };
