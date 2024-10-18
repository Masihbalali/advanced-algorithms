import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DrawerComponent } from "@/components/DrawerComponent";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={"bg-gray-700 w-full z-[1000] fixed top-0 h-14 flex justify-end items-center p-5"}>
          <DrawerComponent />
        </div>
        <div className="mt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
