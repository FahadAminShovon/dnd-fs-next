import { FullScreenLoader } from '@/components/full-screen-loader';
import { Suspense } from 'react';
import { getStatusesAction } from '../status/action';
import { getTagsAction } from '../tags/action';
import CreateTask from './CreateTask';
import TasksList from './TasksList';
import { getTasksAction } from './action';

export default async function Page() {
  const tasks = await getTasksAction();
  const allStatus = await getStatusesAction();
  const allTagsAsync = getTagsAction();

  return (
    <div className="container">
      <div className="flex justify-end mb-4">
        <Suspense fallback={<FullScreenLoader />}>
          <CreateTask tagsAsync={allTagsAsync} statuses={allStatus} />
        </Suspense>
      </div>
      <TasksList tasks={tasks} allStatus={allStatus} tagsAsync={allTagsAsync} />
    </div>
  );
}
