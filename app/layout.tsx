import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="text-white bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <main className="flex flex-col items-center min-h-screen"> */}
          <main>
            {children}
          </main>
          {/* </main> */}
        </ThemeProvider>
      </body>
    </html>
  );
}