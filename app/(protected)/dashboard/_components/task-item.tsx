import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
      {...attributes}
      {...listeners}
      className={`${
        isDragging ? 'opacity-50' : ''
      } transition-all duration-200 ease-in-out`}
    >
      <Item item={item} />
    </div>
  );
};

const Item = ({ item }: ItemProps) => {
  return (
    <Card className="p-2 w-full sm:max-w-[300px] shadow-sm hover:shadow transition-shadow duration-200 rounded-md">
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
    </Card>
  );
};

export { Item, SortableItem };
