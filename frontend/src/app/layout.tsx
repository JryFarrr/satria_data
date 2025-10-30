import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Content Engagement Dashboard",
  description:
    "Dashboard visualisasi metrik engagement konten sosial media milik Satria Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.className} ${poppins.variable} antialiased bg-[#f4ecff] text-slate-800`}
      >
        {children}
      </body>
    </html>
  );
}
