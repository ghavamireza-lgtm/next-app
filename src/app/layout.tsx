import type { Metadata } from "next";
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'راهنمای کسبه مرکز تجاری',
  description: 'راهنمای هوشمند کسبه و اصناف مرکز تجاری',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <header className="border-b">
          <nav className="max-w-5xl mx-auto p-4 flex gap-4 items-center">
            <Link href="/" className="font-bold">خانه</Link>
            <Link href="/businesses">کسبه</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}