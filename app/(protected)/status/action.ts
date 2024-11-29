'use server';

import { requireUser } from '@/app/(auth)/actions';
import type { ActionFormState } from '@/app/types/common';
import { db } from '@/db';
import statuses, {
  type StatusSelectSchemaType,
  statusInsertSchema,
} from '@/db/schema/statuses';
import { revalidateTag, unstable_cache } from 'next/cache';

type CreateStatusStateType = ActionFormState<StatusSelectSchemaType>;

async function createStatusAction(
  _: CreateStatusStateType,
  formData: FormData,
): Promise<CreateStatusStateType> {
  const userId = (await requireUser()).id;
  const data = { ...Object.fromEntries(formData.entries()), userId };
  const parsed = statusInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      message: 'Invalid data',
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const [newStatus] = await db
      .insert(statuses)
      .values(parsed.data)
      .returning();
    revalidateTag('status-list');
    return {
      message: 'Status created successfully',
      data: newStatus,
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

const getStatusesAction = unstable_cache(
  async ({ userId }: { userId: number }) => {
    const statuses = await db.query.statuses.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
    });
    return statuses;
  },
  ['status', 'status-list'],
  {
    tags: ['status-list'],
  },
);

async function getStatusesActionWrapper() {
  const { id } = await requireUser();
  return getStatusesAction({ userId: id });
}

export { createStatusAction, getStatusesActionWrapper as getStatusesAction };
