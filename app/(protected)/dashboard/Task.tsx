import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Grip, Pencil, Trash2 } from 'lucide-react';
import type { RenderKanbanItemType } from './Kanban/kanban.types';
import { deleteTaskAction } from './action';

const Task: RenderKanbanItemType = ({
  item,
  attributes,
  listeners,
  isHoverDisabled,
}) => {
  return (
    <div className="relative group">
      <div
        className={cn(
          'absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 gap-2',
          {
            hidden: isHoverDisabled,
          },
        )}
      >
        <Button variant="ghost">
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          onClick={() => deleteTaskAction({ taskId: item.id })}
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
      <Card
        className="p-2 w-full sm:max-w-[300px] shadow-sm hover:shadow transition-shadow duration-200 rounded-md flex  
		"
        onClick={(e) => {
          e.stopPropagation();
          console.log('clicked');
        }}
      >
        <Button
          {...attributes}
          {...listeners}
          className="h-auto p-0 mr-1 bg-gray-300 hover:bg-gray-300 -ml-2 -my-2 px-1 rounded-r-none"
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
                <Badge variant="outline" className="text-xs" key={tag.id}>
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
