'use client';

import type { UserSelectSchemaType } from '@/db/schema/users';
import { redirect, useSearchParams } from 'next/navigation';
import type React from 'react';
import { use } from 'react';

const AnonymousProvider = ({
  asyncUser,
  children,
}: {
  asyncUser: Promise<UserSelectSchemaType | null>;
  children: React.ReactNode;
}) => {
  const user = use(asyncUser);

  const redirectUrl = useSearchParams().get('redirectTo');

  if (user) {
    if (redirectUrl) {
      return redirect(redirectUrl);
    }
    return redirect('/dashboard');
  }

  return <>{children}</>;
};

export default AnonymousProvider;
