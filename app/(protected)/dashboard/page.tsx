import { getStatusesAction } from '../status/action';
import { getTagsAction } from '../tags/action';
import CreateTask from './CreateTask';

export default function Page() {
  const allTagsAsync = getTagsAction();
  const allStatusesAsync = getStatusesAction();

  return (
    <CreateTask tagsAsync={allTagsAsync} statusesAsync={allStatusesAsync} />
  );
}
