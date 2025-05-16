import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";


import SidebarLayout from "@/components/SidebarLayout"; // Import the new wrapper
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose the weights you need
  variable: "--font-poppins", // Define a CSS variable for the font
});

export const metadata: Metadata = {
  title: "RayDawn Communication Admin Website",
  description: "RayDawn Portfolio Management Dashboard",
  };


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body>
        
          <SidebarLayout>{children}</SidebarLayout>
        
      </body>
    </html>
  );
}

