import SimpleCreateDialog from '@/components/simple-create-component';
import { Badge } from '@/components/ui/badge';
import {} from '@/components/ui/card';
import { randomColors } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createStatusAction, getStatusesAction } from './action';

export default async function OrdersPage() {
  const statuses = await getStatusesAction();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end">
        <SimpleCreateDialog
          action={createStatusAction}
          title="Create a new status"
          triggerButtonText="+ Create Status"
        />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Status Management</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        {statuses.map((status) => (
          <Badge
            variant="outline"
            key={status.name}
            className={cn(
              randomColors[status.id % randomColors.length],
              'text-lg',
            )}
          >
            {status.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
