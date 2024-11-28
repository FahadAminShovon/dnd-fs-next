import type { SelectUserSchemaType } from '@/db/schema/users';

type AuthActionFormState = {
  message: string;
  user?: SelectUserSchemaType;
  issues?: string[];
};

export type { AuthActionFormState };
