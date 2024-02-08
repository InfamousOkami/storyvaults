import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "../lib/redux/provider";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-200">
        <ReduxProvider>
          <Navbar />
          <div className="w-full md:w-[90%] m-auto bg-white">{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
