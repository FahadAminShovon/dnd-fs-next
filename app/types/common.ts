import type { FieldValues } from 'react-hook-form';

type ActionFormState<T extends FieldValues> = {
  message: string;
  data?: T;
  issues?: string[];
};

export type { ActionFormState };
