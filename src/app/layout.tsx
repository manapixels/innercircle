import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/_components/Header';
import Footer from './_components/Footer';
import { UserProvider } from './_contexts/UserContext';
import './globals.css';
import 'tippy.js/dist/tippy.css';
import { AuthProvider } from './_contexts/AuthContext';

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
          <AuthProvider>
            <div className="flex flex-col min-h-screen w-full">
              <Header />
              <div className="flex-grow px-6 py-8 max-w-6xl w-full mx-auto relative">
                {children}
              </div>
              <Footer />
            </div>
            <div id="modal-portal"></div>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
