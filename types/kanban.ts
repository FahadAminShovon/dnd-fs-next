export interface Tag {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  tasksToTags: { tag: Tag }[];
  status: Status;
}

