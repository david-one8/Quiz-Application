import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "QuizNova",
  description: "Online Quiz Management System using Next.js App Router"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-slate-900 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
