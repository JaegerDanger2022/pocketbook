import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pocketbook",
  description: "Know where every coin goes. Log an expense in five seconds.",
};

export const viewport: Viewport = {
  themeColor: "#F6F5F0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} antialiased`}>
      <body>
        <ToastProvider>
          {/* The app is a phone-width column, centered on bigger screens. */}
          <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
