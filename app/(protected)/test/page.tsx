import { KanbanBoard } from '@/components/kanban-board';
import { getTasksAction } from '../dashboard/action';
import { getStatusesAction } from '../status/action';

export default async function Home() {
  const tasks = await getTasksAction();
  const statuses = await getStatusesAction();
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <KanbanBoard initialTasks={tasks} statuses={statuses} />
    </main>
  );
}
