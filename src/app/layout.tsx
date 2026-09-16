import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice MD — Freelancer Invoices + PDF",
  description:
    "Generate professional invoices for freelancers and IT specialists in Moldova. Export to PDF, RO/RU.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:px-6">{children}</main>
    </AppProvider>
  );
}
