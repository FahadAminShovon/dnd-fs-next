import statuses, {
  statusesUserRelations,
  statusesTasksRelations,
} from './statuses';
import tags, { tagsUsersRelations, tagsRelationWithTasks } from './tags';
import tasks, {
  tasksUserRelations,
  tasksStatusRelations,
  tasksRelationWithTags,
} from './tasks';
import tasksToTags, { tasksToTagsRelations } from './tasksToTags';
import users, {
  usersTasksRelations,
  usersTagsRelations,
  usersStatusesRelations,
} from './users';

export {
  statuses,
  statusesUserRelations,
  statusesTasksRelations,
  tasks,
  tasksUserRelations,
  tasksStatusRelations,
  tasksToTags,
  tasksRelationWithTags,
  tasksToTagsRelations,
  tags,
  tagsRelationWithTasks,
  tagsUsersRelations,
  users,
  usersTasksRelations,
  usersTagsRelations,
  usersStatusesRelations,
};
