import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import users from './users';

const tags = pgTable('tags', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  userId: integer().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .$onUpdate(() => new Date())
    .defaultNow(),
});

const tagsUsersRelations = relations(tags, ({ one }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
}));

const tagsInsertSchema = createInsertSchema(tags, {
  userId: z.coerce.number(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const tagsSelectSchema = createSelectSchema(tags);

type TagsInsertSchemaType = z.infer<typeof tagsInsertSchema>;
type TagsSelectSchemaType = z.infer<typeof tagsSelectSchema>;

export { tagsUsersRelations, tagsInsertSchema };
export type { TagsInsertSchemaType, TagsSelectSchemaType };

export default tags;
