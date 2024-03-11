import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
import Header from '@/app/_components/Header';
import './globals.css';
import Footer from './_components/Footer';
import { UserProvider } from './_contexts/UserContext';

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
        <ChakraProvider>
          <UserProvider>
            <Header />
            <div className="px-6 py-8 max-w-6xl mx-auto">{children}</div>
            <Footer />
            <div id="modal-portal"></div>
          </UserProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
