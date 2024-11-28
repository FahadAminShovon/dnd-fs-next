import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import statuses from './statuses';
import tasks from './tasks';

const tasksToStatuses = pgTable(
  'tasks_to_statuses',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    statusId: integer('status_id')
      .notNull()
      .references(() => statuses.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.statusId, t.taskId] })],
);

export default tasksToStatuses;
