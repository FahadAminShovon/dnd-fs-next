import type { Task } from '@/types/kanban';

type ItemProps = {
  item: Task;
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

export default Item;
