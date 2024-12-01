import LayoutWrapper from '@/components/LayoutWrapper';
import { FullScreenLoader } from '@/components/full-screen-loader';
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
    <Suspense fallback={<FullScreenLoader />}>
      <AuthProvider asyncUser={asyncUser}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </AuthProvider>
    </Suspense>
  );
}
