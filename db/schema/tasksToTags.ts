import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import tags from './tags';
import tasks from './tasks';

const tasksToTags = pgTable(
  'tasks_to_tags',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.tagId, t.taskId] })],
);

export default tasksToTags;