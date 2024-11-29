'use client';
import { useRedirectUrl } from '@/app/hooks/useRedirectUrl';
import { type UserSelectSchemaType, userSelectSchema } from '@/db/schema/users';
import { createRequiredContext } from '@/lib/react-utils';
import { redirect } from 'next/navigation';
import type React from 'react';
import { use, useEffect } from 'react';
import { logOut, updateSession } from '../actions';

const [useUser, AuthContextProvider] =
  createRequiredContext<UserSelectSchemaType>();

const AuthProvider = ({
  children,
  asyncUser,
}: {
  children: React.ReactNode;
  asyncUser: Promise<UserSelectSchemaType | null>;
}) => {
  const user = use(asyncUser);
  const parsedUser = userSelectSchema.safeParse(user);
  const { loginRedirect } = useRedirectUrl();

  useEffect(() => {
    if (!parsedUser?.data?.id) {
      logOut();
      return;
    }
    updateSession({ userId: parsedUser.data.id });
  }, [parsedUser?.data?.id]);

  if (!parsedUser.success) {
    return redirect(loginRedirect);
  }

  return (
    <AuthContextProvider value={parsedUser.data}>
      {children}
    </AuthContextProvider>
  );
};

export default AuthProvider;

export { useUser };
