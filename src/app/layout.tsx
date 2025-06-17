import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LocationProvider } from "@/contexts/location-context";
import { NotificationProvider } from "@/contexts/notification-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "astrotrack",
  description: "to keep track of astronomical events"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocationProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
