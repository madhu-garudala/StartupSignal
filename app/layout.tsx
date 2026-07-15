import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StartupSignal | Evidence-backed investment intelligence",
  description: "Turn a startup URL into an evidence-backed venture investigation, committee verdict, and living investment memo.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
