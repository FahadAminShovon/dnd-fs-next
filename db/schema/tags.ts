import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import users from './users';

const tags = pgTable('tags', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  userId: integer().references(() => users.id, { onDelete: 'cascade' }),
});

const tagsUsersRelations = relations(tags, ({ one }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
}));

export { tagsUsersRelations };

export default tags;
