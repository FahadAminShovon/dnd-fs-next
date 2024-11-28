import statuses, { statusesUserRelations } from './statuses';
import tags, { tagsUsersRelations } from './tags';
import tasks, { tasksUserRelations } from './tasks';
import tasksToStatuses from './tasksToStatuses';
import tasksToTags from './tasksToTags1';
import users, {
  usersTasksRelations,
  usersTagsRelations,
  usersStatusesRelations,
} from './users';

export {
  users,
  usersTasksRelations,
  tasks,
  tasksUserRelations,
  tags,
  tagsUsersRelations,
  tasksToTags,
  usersTagsRelations,
  statuses,
  usersStatusesRelations,
  statusesUserRelations,
  tasksToStatuses,
};
