import React from 'react'
import Link from 'next/link'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-navy text-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-2xl font-bold">
            SparkMind
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">
              © {new Date().getFullYear()} SparkMind. All rights reserved.
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/legal/privacy" className="text-navy hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="text-navy hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="text-navy hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}