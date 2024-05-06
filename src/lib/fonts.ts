// import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
// import { GeistMono } from "geist/font/mono"
// import { Inter } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { JetBrains_Mono as FontMono } from 'next/font/google'

// export const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })
export const fontSans = GeistSans

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono'
})

// export const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-sans'
// })
