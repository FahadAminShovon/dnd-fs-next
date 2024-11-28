'use client';
import { useRedirectUrl } from '@/app/hooks/useRedirectUrl';
import { type SelectUserSchemaType, selectUserSchema } from '@/db/schema/users';
import { createRequiredContext } from '@/lib/react-utils';
import { redirect } from 'next/navigation';
import type React from 'react';
import { use, useEffect } from 'react';
import { logOut, updateSession } from '../actions';

const [useUser, AuthContextProvider] =
  createRequiredContext<SelectUserSchemaType>();

const AuthProvider = ({
  children,
  asyncUser,
}: {
  children: React.ReactNode;
  asyncUser: Promise<SelectUserSchemaType | null>;
}) => {
  const user = use(asyncUser);
  const parsedUser = selectUserSchema.safeParse(user);
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
