import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "EcomCenter - Trung tâm dữ liệu e-commerce!",
  description: "Nền tảng thu thập và phân tích dữ liệu thị trường từ các sàn thương mại điện tử",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
