import { Suspense } from 'react';
import { getStatusesAction } from '../status/action';
import { getTagsAction } from '../tags/action';
import CreateTask from './CreateTask';
import KanbanBoard from './KanbanBoard';
import { getTasksAction } from './action';

export default async function Page() {
  const tasks = await getTasksAction();
  const allStatus = await getStatusesAction();
  const allTagsAsync = getTagsAction();

  return (
    <>
      <div className="flex justify-end mb-4">
        <Suspense fallback={<div>Loading...</div>}>
          <CreateTask tagsAsync={allTagsAsync} statuses={allStatus} />
        </Suspense>
      </div>
      <div className="space-y-2">
        <KanbanBoard tasks={tasks} allStatus={allStatus} />
      </div>
    </>
  );
}
