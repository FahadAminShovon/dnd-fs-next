'use server';
import { type SQL, and, eq, inArray, sql } from 'drizzle-orm';

import { requireUser } from '@/app/(auth)/actions';
import { db } from '@/db';
import tasks, {} from '@/db/schema/tasks';
import { revalidateTag } from 'next/cache';
import { type TaskType, tasksListSchema } from '../schema';
import { TASKS_LIST_TAG } from './taskAction.cache';

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

  revalidateTag(TASKS_LIST_TAG);
}

export default rearrangeTasksAction;
