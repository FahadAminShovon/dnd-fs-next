'use server';
import { and, eq } from 'drizzle-orm';

import { requireUser } from '@/app/(auth)/actions';
import type { ActionFormState } from '@/app/types/common';
import { db } from '@/db';
import { tasksToTags } from '@/db/schema';
import tasks, {
  type TaskUpdateSchemaType,
  taskUpdateSchema,
} from '@/db/schema/tasks';
import { revalidateTag } from 'next/cache';
import { TASKS_LIST_TAG } from './taskAction.cache';

type TaskUpdateStateType = ActionFormState<TaskUpdateSchemaType>;

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

    revalidateTag(TASKS_LIST_TAG);
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

export default taskUpdateAction;
