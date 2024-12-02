import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Grip, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { KanbanItemTypeProps } from './_components/Kanban/kanban.types';
import { deleteTaskAction } from './action';

const Task = ({
  item,
  attributes,
  listeners,
  isHoverDisabled,
  onEdit,
  onClick: handleClick,
  isDragging,
}: KanbanItemTypeProps & {
  onEdit: (task: KanbanItemTypeProps['item']) => void;
  onClick: (task: KanbanItemTypeProps['item']) => void;
}) => {
  return (
    <div className="relative group">
      <div
        className={cn(
          'absolute right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2  space-x-2 ',
          {
            hidden: isHoverDisabled,
          },
        )}
      >
        <Button
          variant="ghost"
          onClick={() => onEdit(item)}
          className="bg-gray-200 hover:bg-gray-300 "
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-200 hover:bg-gray-300"
          onClick={() =>
            deleteTaskAction({ taskId: item.id }).then(({ message }) => {
              toast(message);
            })
          }
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
      <Card
        className="p-2 w-full sm:max-w-[300px] shadow-sm hover:shadow transition-shadow duration-200 rounded-md flex  
		"
        onClick={() => {
          handleClick(item);
        }}
      >
        <Button
          {...attributes}
          {...listeners}
          className={cn(
            'h-auto p-0 mr-1 bg-gray-300 hover:bg-gray-300 -ml-2 -my-2 px-1 rounded-r-none',
            {
              'cursor-grabbing': isDragging,
            },
          )}
          variant={'ghost'}
        >
          <Grip />
        </Button>
        <div>
          <CardHeader className="pb-1 pt-0 px-1">
            <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-1 px-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tasksToTags.map(({ tag }) => (
                <Badge className="text-xs" key={tag.id}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export { Task };
