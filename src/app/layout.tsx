import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Profile Preview Generator",
  description:
    "Generate a preview of your Discord profile for use on GitHub or other platforms.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-discord-bg text-discord-text font-sans leading-relaxed m-0">
        {children}
      </body>
    </html>
  );
}
