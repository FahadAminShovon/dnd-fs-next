import type { FieldValues } from 'react-hook-form';
type DBEntityRecord = FieldValues & { id: number };

type FormActionType<T extends DBEntityRecord> = (
  _: ActionFormState<T>,
  formData: FormData,
) => Promise<ActionFormState<T>>;

type ActionFormState<T extends DBEntityRecord> = {
  message: string;
  data?: T;
  issues?: string[];
};

export type { ActionFormState, DBEntityRecord, FormActionType };
