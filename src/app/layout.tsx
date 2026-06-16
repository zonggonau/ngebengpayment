import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ngebeng Payment - Payment Gateway",
    template: "%s | Ngebeng Payment",
  },
  description:
    "Payment gateway untuk semua aplikasi Anda. Satu webhook payment untuk melayani banyak aplikasi dengan dashboard terpusat.",
  keywords: [
    "payment gateway",
    "midtrans",
    "webhook",
    "pembayaran",
    "ngebeng",
  ],
  authors: [{ name: "Ngebeng" }],
  openGraph: {
    title: "Ngebeng Payment - Payment Gateway",
    description:
      "Satu webhook payment untuk melayani banyak aplikasi. Daftarkan apk1, apk2, apk3 Anda dan kelola semua transaksi dari satu dashboard terpusat.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
