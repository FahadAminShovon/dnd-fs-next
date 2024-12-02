'use server';
import { and, eq } from 'drizzle-orm';

import { requireUser } from '@/app/(auth)/actions';
import { db } from '@/db';
import tasks from '@/db/schema/tasks';
import { revalidateTag } from 'next/cache';
import { TASKS_LIST_TAG } from './taskAction.cache';

async function deleteTaskAction({
  taskId,
}: { taskId: number }): Promise<{ message: string }> {
  const userId = (await requireUser()).id;
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidateTag(TASKS_LIST_TAG);
  return {
    message: 'Task deleted successfully',
  };
}

export default deleteTaskAction;
