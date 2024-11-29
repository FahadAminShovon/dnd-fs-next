import SimpleCreateDialog from '@/components/simple-create-component';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { createStatusAction, getStatusesAction } from './action';

const statusColors = [
  'bg-red-100 border-red-200',
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-yellow-100 border-yellow-200',
  'bg-purple-100 border-purple-200',
  'bg-pink-100 border-pink-200',
  'bg-indigo-100 border-indigo-200',
  'bg-teal-100 border-teal-200',
];

export default async function OrdersPage() {
  const statuses = await getStatusesAction();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Status Management</h1>
        <SimpleCreateDialog
          action={createStatusAction}
          title="Create a new status"
          triggerButtonText="+ Create Status"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statuses.map((status, index) => (
          <Card
            key={status.id}
            className={`${statusColors[index % statusColors.length]} border-2`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{status.name}</span>
                <Badge variant="secondary">{status.id}</Badge>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
