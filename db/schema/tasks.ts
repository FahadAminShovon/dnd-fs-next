import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import statuses from './statuses';
import users from './users';

const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  storedTaskId: varchar({ length: 128 })
    .unique()
    .notNull()
    .$default(() => createId()),
  title: varchar({ length: 255 }).notNull(),
  description: text().default('').notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .$onUpdate(() => new Date())
    .defaultNow(),
  userId: integer()
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  orderIndex: integer().notNull().default(0),
  statusId: integer()
    .notNull()
    .references(() => statuses.id, { onDelete: 'cascade' }),
});

const tasksUserRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

const tasksStatusRelations = relations(tasks, ({ one }) => ({
  status: one(statuses, {
    fields: [tasks.statusId],
    references: [statuses.id],
  }),
}));

const tasksInsertSchema = createInsertSchema(tasks, {
  title: z.string().min(1).max(255).trim(),
  description: z.string().default(''),
  userId: z.number().int().positive(),
  statusId: z.coerce.number(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    orderIndex: true,
    storedTaskId: true,
  })
  .merge(
    z.object({
      tags: z.array(z.object({ id: z.coerce.number(), name: z.string() })),
    }),
  );

const tasksSelectSchema = createSelectSchema(tasks);

type TasksSelectSchemaType = z.infer<typeof tasksSelectSchema>;

export {
  tasksUserRelations,
  tasksStatusRelations,
  tasksInsertSchema,
  tasksSelectSchema,
  type TasksSelectSchemaType,
};

export default tasks;
