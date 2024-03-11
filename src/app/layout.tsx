import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChakraProvider } from '@chakra-ui/react';
// import { StoreContextProvider } from "@/app/_lib/actions";
import Header from '@/app/_components/Header';
import './globals.css';
import Footer from './_components/Footer';

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
          <Header />
          <div className="px-6 py-8 max-w-6xl mx-auto">
            {children}
          </div>
          <Footer />
          <div id="modal-portal"></div>
        </ChakraProvider>
      </body>
    </html>
  );
}
