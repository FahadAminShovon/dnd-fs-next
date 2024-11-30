import type { StatusSelectSchemaType } from '@/db/schema/statuses';
import Item from './Item';
import type { TaskType } from './schema';

type ColumnProps = {
  status: StatusSelectSchemaType;
  tasks: TaskType[];
};

const Column = ({ status, tasks }: ColumnProps) => {
  return (
    <div className="p-4 border max-w-sm">
      <h2 className="mb-2">{status.name}</h2>
      <hr className="mb-4" />
      <ol className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <Item key={task.id} item={task} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Column;
