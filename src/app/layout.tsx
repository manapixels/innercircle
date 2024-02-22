import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { StoreContextProvider } from "@/app/_lib/data";
import AuthForm from "./_components/auth/auth-form";

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
        <header>
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="/" className="-m-1.5 p-1.5">
                <Image
                  className="relative"
                  src="/logo.svg"
                  alt="innercircle Logo"
                  width={80}
                  height={55}
                  priority
                />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              <Link href="/events" className="text-sm font-semibold leading-6 text-gray-900">Events</Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">About</Link>
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <button type="button" data-modal-target="default-modal" data-modal-toggle="default-modal" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Log in <span aria-hidden="true">&rarr;</span></button>
            </div>
          </nav>
        </header>
        <StoreContextProvider>
          {children}
        </StoreContextProvider>

        {/* Main modal */}
        <div id="default-modal" tabIndex={-1} aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <AuthForm />
          </div>
        </div>
      </body>
    </html>
  );
}
