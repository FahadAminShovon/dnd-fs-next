import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Status, Task } from '../types/kanban'
import { KanbanItem } from './kanban-item'

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-full md:w-72 bg-gray-100 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{status.name}</h2>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {tasks.map(task => (
            <KanbanItem key={task.id} task={task} />
          ))}
        </ul>
      </SortableContext>
    </div>
  )
}

