import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreContextProvider } from "@/app/_lib/data";
import Header from "@/app/_components/Header";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "innercircle",
  description: "a social initiative app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <StoreContextProvider>{children}</StoreContextProvider>
        <div id="modal-portal"></div>
      </body>
    </html>
  );
}
