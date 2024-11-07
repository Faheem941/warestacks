import type { Metadata, Viewport } from 'next';
import { Nunito_Sans as nunitoSans } from 'next/font/google';
import { ReactNode } from 'react';
import ApolloWrapper from '@/apollo/provider';
import './globals.css';

const nunito = nunitoSans({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export const viewport: Viewport = {
  themeColor: '#0B363C',
};

export const metadata: Metadata = {
  title: 'Warestack - Smart Warehousing Platform',
  description:
    'Warestack is a cloud-based platform transforming warehouse management on a global scale. By connecting logistics companies and warehouse owners, Warestack offers a unified system for businesses seeking flexible storage and logistics solutions. Optimize inventory, streamline operations, and unlock new revenue opportunities with our innovative, interconnected network of warehouses.',
  openGraph: {
    title: 'Warestack - Smart Warehousing Platform',
    description:
      'Warestack connects logistics companies and warehouse owners on a global platform, offering a marketplace for flexible storage solutions and optimized warehouse operations. Revolutionize your logistics with a centralized system designed for efficiency and scalability.',
    type: 'website',
    images: [
      {
        url: 'https://warestacks.com/icon.ico',
        width: 512,
        height: 512,
        alt: 'Warestacks Icon',
      },
    ],
    url: new URL('https://warestacks.com'),
  },
  metadataBase: new URL('https://warestacks.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={nunito.className}>
        <ApolloWrapper>{children} </ApolloWrapper>
      </body>
    </html>
  );
}
