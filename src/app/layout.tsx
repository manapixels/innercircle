import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { StoreContextProvider } from "@/app/_lib/actions";
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
// const supabase = createClient()
//   supabase.auth.onAuthStateChange((event, session) => {
//     if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
//       // delete cookies on sign out
//       const expires = new Date(0).toUTCString()
//       document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
//       document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
//     } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
//       const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
//       document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
//       document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
//     }
//   })

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        {/* <StoreContextProvider> */}
          {children}
          {/* </StoreContextProvider> */}
        <div id="modal-portal"></div>
      </body>
    </html>
  );
}
