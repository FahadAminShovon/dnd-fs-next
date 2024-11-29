import { passwordSchema } from '@/lib/schemas';
import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import statuses from './statuses';
import tags from './tags';
import tasks from './tasks';

const users = pgTable('users', {
  id: serial().primaryKey(),
  username: varchar({ length: 20 }).unique().notNull(),
  email: varchar({ length: 100 }).unique().notNull(),
  password: varchar({ length: 60 }).notNull(),
  firstName: varchar({ length: 50 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .$onUpdate(() => new Date())
    .defaultNow(),
});

const usersTasksRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

const usersTagsRelations = relations(users, ({ many }) => ({
  tags: many(tags),
}));

const usersStatusesRelations = relations(users, ({ many }) => ({
  statuses: many(statuses),
}));

const userInsertSchema = createInsertSchema(users, {
  password: passwordSchema,
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  username: z.string().min(1).max(20).trim(),
  email: z
    .string()
    .min(1)
    .email()
    .trim()
    .transform((v) => v.toLowerCase()),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .merge(
    z.object({
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const userSelectSchema = createSelectSchema(users).omit({
  password: true,
});

const signinUserSchema = createSelectSchema(users, {
  email: z
    .string()
    .email()
    .trim()
    .transform((v) => v.toLowerCase()),
}).pick({
  email: true,
  password: true,
});

type userInsertSchemaType = z.infer<typeof userInsertSchema>;
type UserSelectSchemaType = z.infer<typeof userSelectSchema>;

export { userInsertSchema, userSelectSchema, signinUserSchema };

export type { userInsertSchemaType, UserSelectSchemaType };
export { usersTasksRelations, usersTagsRelations, usersStatusesRelations };

export default users;
