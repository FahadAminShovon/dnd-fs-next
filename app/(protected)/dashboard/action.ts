'use server';
import { type SQL, and, eq, inArray, sql } from 'drizzle-orm';

import { requireUser } from '@/app/(auth)/actions';
import type { ActionFormState } from '@/app/types/common';
import { db } from '@/db';
import { tasksToTags } from '@/db/schema';
import tasks, {
  type TaskUpdateSchemaType,
  type TasksSelectSchemaType,
  taskUpdateSchema,
  tasksInsertSchema,
} from '@/db/schema/tasks';
import { revalidateTag, unstable_cache } from 'next/cache';
import { type TaskType, tasksListSchema } from './schema';

type TaskCreateStateType = ActionFormState<TasksSelectSchemaType>;
type TaskUpdateStateType = ActionFormState<TaskUpdateSchemaType>;

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

async function taskUpdateAction(
  _prev: TaskUpdateStateType,
  formData: FormData,
): Promise<TaskUpdateStateType> {
  const data = Object.fromEntries(formData.entries());
  const tags = data.tags;
  data.tags = [] as any;

  if (tags && typeof tags === 'string') {
    data.tags = JSON.parse(tags);
  }

  const parsed = taskUpdateSchema.safeParse({ ...data, id: +data.id });
  if (!parsed.success) {
    return {
      message: 'Invalid data',
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const userId = (await requireUser()).id;
    await db.transaction(async (tx) => {
      const { tags, ...taskData } = parsed.data;
      await tx
        .update(tasks)
        .set({
          ...taskData,
        })
        .where(and(eq(tasks.id, parsed.data.id), eq(tasks.userId, userId)));

      await tx
        .delete(tasksToTags)
        .where(eq(tasksToTags.taskId, parsed.data.id));

      if (tags.length > 0) {
        await tx.insert(tasksToTags).values(
          tags.map((tag) => ({
            taskId: parsed.data.id,
            tagId: tag.id,
          })),
        );
      }
    });

    revalidateTag('tasks-list');
    return {
      message: 'Task updated successfully',
      data: parsed.data,
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
    tags: ['tasks-list'],
  },
);

async function getTasksActionWrapper() {
  const user = await requireUser();
  const tasks = getTasksAction({ userId: user.id });
  return tasks;
}

async function rearrangeTasksAction({
  tasks: tasksToUpdate,
}: { tasks: TaskType[] }) {
  const parsed = tasksListSchema.safeParse(tasksToUpdate);

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((issue) => issue.message).join(', '),
    );
  }

  const groups = parsed.data.reduce(
    (acc, task) => {
      if (!acc[task.statusId]) {
        acc[task.statusId] = [];
      }
      acc[task.statusId].push(task);
      return acc;
    },
    {} as Record<number, TaskType[]>,
  );

  for (const groupKey in groups) {
    groups[groupKey].forEach((task, index) => {
      task.orderIndex = index;
    });
  }

  const userId = (await requireUser()).id;

  // batch update tasks with new orderIndex and statusId
  const oiSqlChunks: SQL[] = [];
  const statusIdSqlChunks: SQL[] = [];
  const ids = [];

  oiSqlChunks.push(sql`(case`);
  statusIdSqlChunks.push(sql`(case`);
  for (const groupKey in groups) {
    const group = groups[groupKey];
    const statusId = group[0].statusId;
    for (const task of group) {
      statusIdSqlChunks.push(
        sql`when ${tasks.id} = ${task.id} then CAST(${statusId} as integer)`,
      );
      oiSqlChunks.push(
        sql`when ${tasks.id} = ${task.id} then CAST(${+task.orderIndex} as integer)`,
      );
      ids.push(task.id);
    }
  }
  statusIdSqlChunks.push(sql`end)`);
  oiSqlChunks.push(sql`end)`);

  const orderIndexFinalSql: SQL = sql.join(oiSqlChunks, sql.raw(' '));
  const statusIdFinalSql: SQL = sql.join(statusIdSqlChunks, sql.raw(' '));

  await db
    .update(tasks)
    .set({ orderIndex: orderIndexFinalSql, statusId: statusIdFinalSql })
    .where(and(inArray(tasks.id, ids), eq(tasks.userId, userId)));

  revalidateTag('tasks-list');
}

async function deleteTaskAction({ taskId }: { taskId: number }) {
  const userId = (await requireUser()).id;
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidateTag('tasks-list');
}

export {
  taskCreateAction,
  taskUpdateAction,
  getTasksActionWrapper as getTasksAction,
  rearrangeTasksAction,
  deleteTaskAction,
};
