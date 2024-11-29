'use server';

import { db } from '@/db';
import { tags } from '@/db/schema';
import { tagsInsertSchema } from '@/db/schema/tags';

async function createTag(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = tagsInsertSchema.safeParse(data);

  if (!parsed.success) {
    return;
  }

  const [newTag] = await db.insert(tags).values(parsed.data).returning();
}
