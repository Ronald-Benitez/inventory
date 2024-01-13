import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Provider } from "./provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema empresarial',
  description: 'Sistema multi empresarial',
}

export const viewport: Viewport = {
  // viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
