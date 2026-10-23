import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "TaskFlow AI - لوحة تحكم إدارة المهام والإنتاجية",
  description: "لوحة تحكم تفاعلية لإدارة المشاريع والمهام اليومية مع إحصائيات دقيقة وتتبع الأداء.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} antialiased bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}