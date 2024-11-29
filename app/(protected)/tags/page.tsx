import SimpleCreateDialog from '@/components/simple-create-component';
import { createTagAction, getTagsAction } from './action';

async function TagsPage() {
  const tags = await getTagsAction();
  return (
    <div>
      <div className="w-full flex">
        {JSON.stringify(tags)}
        <div className="ml-auto">
          <SimpleCreateDialog
            action={createTagAction}
            title="Create a new tag"
            triggerButtonText="+ Create Tag"
          />
        </div>
      </div>
    </div>
  );
}

export default TagsPage;
