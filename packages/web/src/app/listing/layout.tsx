import { ReactNode, Suspense } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <Suspense>{children}</Suspense>;
}
