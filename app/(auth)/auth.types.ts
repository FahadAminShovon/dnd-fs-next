import type { UserSelectSchemaType } from '@/db/schema/users';
import type { ActionFormState } from '../types/common';

type AuthActionFormState = ActionFormState<UserSelectSchemaType>;

export type { AuthActionFormState };
