import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip } from 'lucide-react';
import type { TaskType } from '../schema';

type ItemProps = {
  item: TaskType;
};

const SortableItem = ({ item }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task-${item.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={` w-full ${
        isDragging ? 'opacity-50' : ''
      } transition-all duration-200 ease-in-out`}
    >
      <Item item={item} attributes={attributes} listeners={listeners} />
    </div>
  );
};

const Item = ({
  item,
  attributes,
  listeners,
}: ItemProps & {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}) => {
  return (
    <Card className="p-2 w-full sm:max-w-[300px] shadow-sm hover:shadow transition-shadow duration-200 rounded-md flex">
      <Button
        {...attributes}
        {...listeners}
        className="h-auto p-0 mr-1 bg-gray-300 hover:bg-gray-400 -ml-2 -my-2 px-1 rounded-r-none"
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
  );
};

export { Item, SortableItem };
