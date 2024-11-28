import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import users from './users';

const statuses = pgTable('statuses', {
  id: serial().primaryKey(),
  name: varchar({ length: 60 }).unique().notNull(),
  userId: integer().references(() => users.id, { onDelete: 'cascade' }),
});

const statusesUserRelations = relations(statuses, ({ one }) => ({
  users: one(users, {
    fields: [statuses.userId],
    references: [users.id],
  }),
}));

export default statuses;

export { statusesUserRelations };
