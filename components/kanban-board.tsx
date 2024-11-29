'use client'

import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Status, Task } from '../types/kanban'
import { KanbanColumn } from './kanban-column'
import { KanbanItem } from './kanban-item'

interface KanbanBoardProps {
  initialTasks: Task[]
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const statuses: Status[] = Array.from(new Set(tasks.map(task => task.status))).sort((a, b) => a.id - b.id)

  const getTasksByStatus = (statusId: number) => {
    return tasks.filter(task => task.status.id === statusId).sort((a, b) => a.orderIndex - b.orderIndex)
  }

  const handleDragStart = (event: any) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragOver = (event: any) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(task => task.id === active.id)
    const overTask = tasks.find(task => task.id === over.id)

    if (!activeTask || !overTask || activeTask.status.id === overTask.status.id) {
      return
    }

    setTasks(tasks => {
      const oldIndex = tasks.findIndex(task => task.id === active.id)
      const newIndex = tasks.findIndex(task => task.id === over.id)

      return arrayMove(tasks, oldIndex, newIndex).map((task, index) => {
        if (task.id === active.id) {
          return { ...task, status: overTask.status, orderIndex: overTask.orderIndex }
        }
        if (task.status.id === overTask.status.id && task.orderIndex >= overTask.orderIndex) {
          return { ...task, orderIndex: task.orderIndex + 1 }
        }
        return task
      })
    })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setTasks(tasks => {
        const oldIndex = tasks.findIndex(task => task.id === active.id)
        const newIndex = tasks.findIndex(task => task.id === over.id)

        return arrayMove(tasks, oldIndex, newIndex).map((task, index) => ({
          ...task,
          orderIndex: index,
        }))
      })
    }

    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 md:flex-row">
        {statuses.map(status => (
          <KanbanColumn key={status.id} status={status} tasks={getTasksByStatus(status.id)} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? <KanbanItem task={tasks.find(task => task.id === activeId)!} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

