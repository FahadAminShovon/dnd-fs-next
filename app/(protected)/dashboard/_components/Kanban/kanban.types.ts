import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { TaskType } from '../../tasks.schema';

type KanbanItemTypeProps = {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  isHoverDisabled?: boolean;
  isDragging?: boolean;
} & {
  item: TaskType;
};

type RenderKanbanItemType = React.FC<KanbanItemTypeProps>;

export type { RenderKanbanItemType, KanbanItemTypeProps };
