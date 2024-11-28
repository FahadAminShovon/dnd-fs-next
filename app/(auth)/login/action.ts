'use server';

import { db } from '@/db';
import { selectUserSchema, signinUserSchema } from '@/db/schema/user';
import bcrypt from 'bcrypt';
import { createSession } from '../actions';
import type { AuthActionFormState } from '../auth.types';

async function loginAction(
  _: AuthActionFormState,
  formData: FormData,
): Promise<AuthActionFormState> {
  const data = Object.fromEntries(formData.entries());
  const parsed = await signinUserSchema.safeParse(data);

  if (parsed.success) {
    try {
      const user = await db.query.user.findFirst({
        where(fields, { eq }) {
          return eq(fields.email, parsed.data.email);
        },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(
        parsed.data.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      await createSession({ userId: user.id });
      return {
        message: 'User logged in successfully',
        user: selectUserSchema.parse(user),
      };
    } catch (e) {
      if (e instanceof Error) {
        return {
          message: e.message,
          issues: [e.message],
        };
      }
    }
  }

  return {
    message: 'User login failed',
    issues: parsed?.error?.issues.map((issue) => issue.message),
  };
}
export { loginAction };
