import { FullScreenLoader } from '@/components/full-screen-loader';
import { Suspense } from 'react';
import { getUser } from './actions';
import AnonymousProvider from './provider/AnonymousProvider';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const asyncUser = getUser();

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <div className="h-dvh content-center">
        <AnonymousProvider asyncUser={asyncUser}>{children}</AnonymousProvider>
      </div>
    </Suspense>
  );
}
