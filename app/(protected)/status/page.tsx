import SimpleCreateDialog from '@/components/simple-create-component';
import { createStatusAction, getStatusesAction } from './action';

export default async function OrdersPage() {
  const statuses = await getStatusesAction();
  return (
    <div>
      <h1>Status</h1>
      <div className="w-full flex">
        {JSON.stringify(statuses)}
        <div className="ml-auto">
          <SimpleCreateDialog
            action={createStatusAction}
            title="Create a new status"
            triggerButtonText="+ Create Status"
          />
        </div>
      </div>
    </div>
  );
}
