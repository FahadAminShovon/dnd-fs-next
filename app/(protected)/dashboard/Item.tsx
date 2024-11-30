import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskType } from './schema';

type ItemProps = {
  item: TaskType;
};

const SortableItem = ({ item }: ItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `task-${item.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item item={item} />
    </div>
  );
};

const Item = ({ item }: ItemProps) => {
  return (
    <div className="p-4 border">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p className="bg-cyan-400 w-max px-2 py-1">{item.status.name}</p>
    </div>
  );
};

export { Item, SortableItem };
