import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import tasks from './tasks';
import users from './users';

const statuses = pgTable('statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 60 }).unique().notNull(),
  userId: integer().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .$onUpdate(() => new Date())
    .defaultNow(),
});

const statusesUserRelations = relations(statuses, ({ one }) => ({
  users: one(users, {
    fields: [statuses.userId],
    references: [users.id],
  }),
}));

const statusesTasksRelations = relations(statuses, ({ many }) => ({
  tasks: many(tasks),
}));

const statusInsertSchema = createInsertSchema(statuses).omit({
  id: true,
});

const statusSelectSchema = createSelectSchema(statuses);

type StatusSelectSchemaType = z.infer<typeof statusSelectSchema>;

export default statuses;

export {
  statusesUserRelations,
  statusesTasksRelations,
  statusInsertSchema,
  statusSelectSchema,
  type StatusSelectSchemaType,
};
