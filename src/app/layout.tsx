import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "PadhAI — AI-Powered Classroom Learning",
  description:
    "Transform static educational materials into interactive, structured learning resources with AI-powered quizzes, explanations, flashcards, and adaptive recommendations.",
  keywords: [
    "AI",
    "education",
    "classroom",
    "learning",
    "quiz",
    "flashcards",
    "AWS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                maxWidth: "340px",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
