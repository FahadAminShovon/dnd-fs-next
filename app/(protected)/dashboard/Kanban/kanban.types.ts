import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { TaskType } from '../schema';

type RenderKanbanItemType = React.FC<
  {
    attributes?: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  } & {
    item: TaskType;
  }
>;

export type { RenderKanbanItemType };
