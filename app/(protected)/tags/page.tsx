import SimpleCreateDialog from '@/components/simple-create-component';
import { Badge } from '@/components/ui/badge';
import {} from '@/components/ui/card';
import { createTagAction, getTagsAction } from './action';

function generateColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 90%)`;
}

export default async function TagsPage() {
  const tags = await getTagsAction();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tag Management</h1>
        <SimpleCreateDialog
          action={createTagAction}
          title="Create a new tag"
          triggerButtonText="+ Create Tag"
        />
      </div>
      <div className="flex gap-4">
        {tags.map((tag) => {
          return (
            <Badge className="text-lg font-semibold" key={tag.id}>
              {tag.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
