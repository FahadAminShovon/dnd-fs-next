'use server';
import { requireUser } from '@/app/(auth)/actions';
import { db } from '@/db';

import { unstable_cache } from 'next/cache';
import { tasksListSchema } from '../schema';
import { TASKS_LIST_TAG } from './taskAction.cache';

const getTasksAction = unstable_cache(
  async ({ userId: id }: { userId: number }) => {
    const tasks = await db.query.tasks.findMany({
      orderBy: (fields, { asc }) => [
        asc(fields.statusId),
        asc(fields.orderIndex),
      ],
      where(fields, operators) {
        return operators.eq(fields.userId, id);
      },
      columns: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
        statusId: true,
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
    tags: [TASKS_LIST_TAG],
  },
);

async function getTasksActionWrapper() {
  const user = await requireUser();
  const tasks = getTasksAction({ userId: user.id });
  return tasks;
}

export default getTasksActionWrapper;
