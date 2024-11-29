import { statusSelectSchema } from '@/db/schema/statuses';
import { tagsSelectSchema } from '@/db/schema/tags';
import { tasksSelectSchema } from '@/db/schema/tasks';
import { z } from 'zod';

const normalizedTaskSchema = tasksSelectSchema
  .pick({
    id: true,
    title: true,
    description: true,
    orderIndex: true,
  })
  .merge(
    z.object({
      tasksToTags: z.array(
        z.object({
          tag: tagsSelectSchema.pick({
            id: true,
            name: true,
          }),
        }),
      ),
      status: statusSelectSchema.pick({
        id: true,
        name: true,
      }),
    }),
  );

const tasksListSchema = z.array(normalizedTaskSchema);

export { tasksListSchema };
