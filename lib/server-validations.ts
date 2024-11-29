'use server';

import { db } from '@/db';

export async function checkIfEmailExists(email: string): Promise<boolean> {
  const existinEmail = !!(await db.query.users.findFirst({
    where(fields, { eq }) {
      return eq(fields.email, email);
    },
  }));
  return !existinEmail;
}
