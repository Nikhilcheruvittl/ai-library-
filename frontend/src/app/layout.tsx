import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenLibrary — Catalog Explorer',
  description: 'Search and discover thousands of books in the OpenLibrary classic catalog.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f8f5f0] text-slate-800 font-sans min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

