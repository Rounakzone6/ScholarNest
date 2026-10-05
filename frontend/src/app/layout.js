import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopContextProvider from "@/context/ShopContext";

// We'll define the metadata later or fetch it, but here are the defaults
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://scholarnest.com"),
  title: {
    template: "%s | ScholarNest",
    default: "ScholarNest — Student Marketplace for Buying & Selling Second-Hand Items",
  },
  description: "Buy a used Casio FX-991ES scientific calculator or find affordable second-hand essentials from students around your campus. Good finds deserve another semester.",
  openGraph: {
    type: "website",
    siteName: "ScholarNest",
    url: "/",
    images: [{ url: "/og-default.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <ShopContextProvider>
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <Navbar />
          </div>
          <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            {children}
          </main>
          <Footer />
        </ShopContextProvider>
      </body>
    </html>
  );
}
