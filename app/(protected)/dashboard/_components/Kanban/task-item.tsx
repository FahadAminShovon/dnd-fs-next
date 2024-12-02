import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskType } from '../../tasks.schema';
import type { RenderKanbanItemType } from './kanban.types';

export type ItemProps = {
  item: TaskType;
  renderItem: RenderKanbanItemType;
};

const SortableItem = ({ item, renderItem }: ItemProps) => {
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
      className={cn({
        'opacity-45': isDragging,
      })}
    >
      <div>{renderItem({ item, attributes, listeners, isDragging })}</div>
    </div>
  );
};

export { SortableItem };
