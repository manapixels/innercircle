import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/app/_components/Header';
import Footer from './_components/Footer';
import { UserProvider } from './_contexts/UserContext';
import './globals.css';
import 'tippy.js/dist/tippy.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'innercircle',
  description: 'a social initiative app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
          <UserProvider>
            <Header />
            <div className="px-6 py-8 max-w-6xl mx-auto">{children}</div>
            <Footer />
            <div id="modal-portal"></div>
          </UserProvider>
      </body>
    </html>
  );
}
