import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import { randomColors } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteTaskAction } from './action';
import type { TaskType } from './tasks.schema';

const TaskView = ({
  task,
  onClose,
  onEdit,
  allStatus,
}: {
  task: TaskType;
  onClose: () => void;
  onEdit: (task: TaskType) => void;
  allStatus: StatusSelectSchemaType[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const status = allStatus.find((status) => status.id === task.statusId);

  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            {task.description || 'No description provided.'}
          </DialogDescription>
        </DialogHeader>

        <div>
          <h3 className="text-lg font-semibold">Status</h3>
          <Badge
            variant="outline"
            className={cn(
              status
                ? randomColors[status.id % randomColors.length]
                : randomColors[0],
              'text-lg',
            )}
          >
            {status ? status.name : 'No status'}
          </Badge>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tasksToTags.map((taskTag) => (
              <Badge key={taskTag.tag.id}>{taskTag.tag.name}</Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant={'outline'}>
            Close
          </Button>
          <Button
            onClick={() => {
              deleteTaskAction({ taskId: task.id }).then(({ message }) => {
                toast(message);
              });
            }}
            variant="destructive"
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              onEdit(task);
            }}
            variant={'default'}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskView;
