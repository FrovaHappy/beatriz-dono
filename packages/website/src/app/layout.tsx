import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./normalize.css"
import './globals.scss'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Beatriz Bot - Website',
  description: 'Herramienta para generar fácilmente las bienvenidas del bot.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}


