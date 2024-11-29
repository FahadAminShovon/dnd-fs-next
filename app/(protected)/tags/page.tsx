import SimpleCreateDialog from '@/components/simple-create-component';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <SimpleCreateDialog
          action={createTagAction}
          title="Create a new tag"
          triggerButtonText="+ Create Tag"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tags.map((tag) => {
          const bgColor = generateColor(tag.name);
          return (
            <Card
              key={tag.id}
              className="flex flex-col justify-between border-2"
              style={{ backgroundColor: bgColor, borderColor: bgColor }}
            >
              <CardHeader>
                <CardTitle className="text-center">
                  <Badge variant="secondary" className="text-lg font-semibold">
                    {tag.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              {/* <CardContent>
                <p className="text-center text-sm text-muted-foreground">
                  ID: {tag.id}
                </p>
              </CardContent> */}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
