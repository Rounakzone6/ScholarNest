import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Skeleton } from "./components/ui/Skeleton";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Browse = lazy(() => import("./pages/Browse"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const Sell = lazy(() => import("./pages/Sell"));
const Exchanges = lazy(() => import("./pages/Exchanges"));
const Login = lazy(() => import("./pages/Login"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const EmailVerify = lazy(() => import("./pages/EmailVerify"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const PageLoader = () => (
  <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
    <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-primary-100 text-2xl font-extrabold text-primary-600">
      S
    </div>
    <div className="flex gap-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "0ms" }}></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "150ms" }}></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: "300ms" }}></div>
    </div>
  </div>
);

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
      
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navbar />
      </div>

      <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Marketplace */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/listing/:listingId" element={<ListingDetail />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Dashboards & Workflows */}
            <Route path="/sell" element={<Sell />} />
            <Route path="/orders" element={<Exchanges />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:username" element={<MyProfile />} />
            <Route path="/account/*" element={<MyProfile />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default App;
