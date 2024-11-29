import { getStatusesAction } from '../status/action';
import { getTagsAction } from '../tags/action';
import CreateTask from './CreateTask';
import { getTasksAction } from './action';

export default async function Page() {
  const tasks = await getTasksAction();
  const allTagsAsync = getTagsAction();
  const allStatusesAsync = getStatusesAction();

  return (
    <>
      <div>
        <CreateTask tagsAsync={allTagsAsync} statusesAsync={allStatusesAsync} />
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Order Index: {task.orderIndex}</p>
            <p>Status: {task.status.name}</p>
            <p>Tags: {task.tasksToTags.map((t) => t.tag.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </>
  );
}
