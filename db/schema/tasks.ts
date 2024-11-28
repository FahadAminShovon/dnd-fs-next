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
import statuses from './statuses';
import users from './users';

const tasks = pgTable('tasks', {
  id: serial().primaryKey(),
  storedTaskId: varchar({ length: 128 })
    .unique()
    .notNull()
    .$default(() => createId()),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .$onUpdate(() => new Date())
    .defaultNow(),
  userId: integer().references(() => users.id, { onDelete: 'cascade' }),
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

export { tasksUserRelations, tasksStatusRelations };

export default tasks;
