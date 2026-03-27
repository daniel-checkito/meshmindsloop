import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "./_components/site-header";

export const metadata: Metadata = {
  title: "Meshminds 3D",
  description: "3D printing tools by @meshminds3d"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
