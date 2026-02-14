import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

// ตั้งค่าฟอนต์ Mali เพื่อให้ดูเป็นกันเองและเข้ากับธีมวาเลนไทน์
const mali = Mali({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CVC Valentine Booth 2026",
  description: "Photo booth for CVC Youth Valentine's Day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={mali.className}>
        {children}
      </body>
    </html>
  );
}