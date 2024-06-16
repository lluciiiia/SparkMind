import '@/styles/css/globals.css';
import { Providers } from '@/providers';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={``} suppressHydrationWarning>
      <body
        className={`
          bg-background text-foreground
        `}
      >
        <Providers>
          <main
            className={`
            min-h-screen flex flex-col items-center
            `}
          >
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
