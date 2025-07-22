// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/UserContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Your App",
  description: "SaaS Workflow Automation App",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProvider>
            <main className="flex items-center justify-center min-h-screen p-4">
              {children}
            </main>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
