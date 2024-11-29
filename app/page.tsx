import { KanbanBoard } from '../components/kanban-board'
import { Task } from '../types/kanban'

const initialTasks: Task[] = [
  {"id":3,"title":"task 1","description":"desc 1","orderIndex":0,"tasksToTags":[],"status":{"id":1,"name":"backlog"}},
  {"id":4,"title":"task 2","description":"desc 2","orderIndex":1,"tasksToTags":[{"tag":{"id":2,"name":"front-end"}},{"tag":{"id":5,"name":"typescript"}}],"status":{"id":1,"name":"backlog"}},
  {"id":5,"title":"task 3","description":"desc 3","orderIndex":0,"tasksToTags":[{"tag":{"id":2,"name":"front-end"}},{"tag":{"id":3,"name":"back-end"}}],"status":{"id":2,"name":"To-do"}},
  {"id":6,"title":"task 4","description":"desc 4","orderIndex":1,"tasksToTags":[{"tag":{"id":2,"name":"front-end"}},{"tag":{"id":3,"name":"back-end"}}],"status":{"id":2,"name":"To-do"}},
  {"id":7,"title":"task 5","description":"desc 5","orderIndex":2,"tasksToTags":[],"status":{"id":2,"name":"To-do"}}
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <KanbanBoard initialTasks={initialTasks} />
    </main>
  )
}

