import LayoutWrapper from '@/components/LayoutWrapper';
import { Suspense } from 'react';
import { getUser, logOut } from '../(auth)/actions';
import AuthProvider from '../(auth)/provider/AuthProvider';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const asyncUser = getUser().catch(() => {
    logOut();
    return null;
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider asyncUser={asyncUser}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </AuthProvider>
    </Suspense>
  );
}
