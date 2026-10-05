import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export const metadata = {
  title: "Page Not Found | ScholarNest",
  robots: {
    index: false,
    follow: true,
  }
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-slate-100 text-slate-400">
        <Search className="h-10 w-10" />
      </div>
      <h1 className="heading mt-8 text-4xl font-extrabold text-slate-900">
        We couldn't find that page.
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-600">
        The listing may have been deleted, or the link is broken.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="secondary" size="lg">Go to Homepage</Button>
        </Link>
        <Link href="/browse">
          <Button size="lg">Browse marketplace</Button>
        </Link>
      </div>
    </main>
  );
}
