'use server';
import { requireUser } from '@/app/(auth)/actions';
import type { ActionFormState } from '@/app/types/common';
import { db } from '@/db';
import { tags as TagsTable } from '@/db/schema';
import { type TagsSelectSchemaType, tagsInsertSchema } from '@/db/schema/tags';
import { revalidateTag, unstable_cache } from 'next/cache';

type CreateTagStateType = ActionFormState<TagsSelectSchemaType>;

async function createTagAction(
  _: CreateTagStateType,
  formData: FormData,
): Promise<CreateTagStateType> {
  const { id: userId } = await requireUser();
  const data = { ...Object.fromEntries(formData.entries()), userId };
  const parsed = tagsInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      message: 'Invalid data',
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const [newTag] = await db.insert(TagsTable).values(parsed.data).returning();
    revalidateTag('tag-list');
    return {
      message: 'Tag created successfully',
      data: newTag,
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

const getTagsAction = unstable_cache(
  async ({ userId }: { userId: number }) => {
    const tags = await db.query.tags.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
    });
    return tags;
  },
  ['tags', 'tag-list'],
  {
    tags: ['tag-list'],
  },
);

async function getTagsActionWrapper() {
  const { id } = await requireUser();
  return await getTagsAction({ userId: id });
}

export { createTagAction, getTagsActionWrapper as getTagsAction };
