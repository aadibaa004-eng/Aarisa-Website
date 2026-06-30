import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arisa Nutrition API",
  description: "Production-ready dietician backend API built with Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
