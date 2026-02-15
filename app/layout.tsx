import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KanbanProvider } from "@/src/context/KanbanContext";

// Inter font professional aur clean look ke liye
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KanbanFlow | Project Management",
  description: "Modern Trello-style board for team collaboration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#F1F2F4] text-[#172B4D]`}>
        {/* KanbanProvider pure app mein state management handle karega */}
        <KanbanProvider>
          {children}
        </KanbanProvider>
      </body>
    </html>
  );
}