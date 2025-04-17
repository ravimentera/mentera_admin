import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "California MedSpa Finder",
  description:
    "Find medical spas in California cities and download results as CSV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="app-header">
          <div className="header-content">
            <div className="logo-container">
              <img src="/logo.png" alt="Mentera Logo" className="app-logo" />
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
