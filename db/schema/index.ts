import statuses, {
  statusesUserRelations,
  statusesTasksRelations,
} from './statuses';
import tags, { tagsUsersRelations } from './tags';
import tasks, { tasksUserRelations, tasksStatusRelations } from './tasks';
import tasksToTags from './tasksToTags';
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
  tags,
  tagsUsersRelations,
  users,
  usersTasksRelations,
  usersTagsRelations,
  usersStatusesRelations,
};
