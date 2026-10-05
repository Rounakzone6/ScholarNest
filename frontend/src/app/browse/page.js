import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

const categories = [
  "Books & Study Material",
  "Electronics",
  "Hostel Essentials",
  "Furniture",
  "Cycles & Vehicles",
  "Fashion",
  "Sports",
  "Gaming",
  "Musical Instruments",
  "Stationery",
  "Other"
];

const conditions = [
  { label: "Like New", value: "Like New" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" }
];

const sortOptions = [
  { label: "Recently listed", value: "newest" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" }
];

export async function generateMetadata({ searchParams }) {
  const { q, category } = await searchParams;
  let title = "Browse Items";
  if (category && q) title = `${q} in ${category}`;
  else if (category) title = `${category} for Students`;
  else if (q) title = `Search results for "${q}"`;
  
  return {
    title,
    description: `Find exactly what you need for your classes or dorm. Search by category, condition, and price in the ScholarNest marketplace.`
  };
}

export default async function BrowsePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  
  const queryParams = new URLSearchParams(resolvedParams);
  let listings = [];
  let error = false;

  try {
    const res = await fetch(`${backendUrl}/api/listings?${queryParams.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      listings = data.listings || [];
    } else {
      error = true;
    }
  } catch (e) {
    error = true;
  }

  // Active filters count
  const hasFilters = Object.keys(resolvedParams).length > 0;

  return (
    <main className="mx-auto max-w-[1440px] py-8 pb-28 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary-600">
          Campus marketplace
        </p>
        <h1 className="heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Find your next useful thing.
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Good finds, fair prices, and students nearby.
        </p>
      </div>

      {/* Main Search Bar */}
      <form method="GET" action="/browse" className="mb-8 flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary-500">
        <div className="flex w-12 items-center justify-center text-slate-400">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          name="q"
          defaultValue={resolvedParams.q || ""}
          aria-label="Search listings"
          placeholder="Search books, calculators, hostel essentials…"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-500 sm:text-base"
        />
        {/* Preserve other params like category, sort */}
        {Object.entries(resolvedParams).map(([key, val]) => {
          if (key !== "q") return <input key={key} type="hidden" name={key} value={val} />;
          return null;
        })}
        <Button type="submit" size="lg" className="px-6">
          Search
        </Button>
      </form>

      {/* Simple Form-based Filter Links */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = resolvedParams.category === cat;
          return (
            <Link 
              key={cat}
              href={`/browse?category=${encodeURIComponent(cat)}${resolvedParams.q ? `&q=${encodeURIComponent(resolvedParams.q)}` : ''}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-primary-600 text-white" : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="font-bold text-slate-900">
          {listings.length} {listings.length === 1 ? "listing" : "listings"}
        </h2>
        {hasFilters && (
          <Link 
            href="/browse"
            className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Clear all filters
          </Link>
        )}
      </div>

      {/* Results Grid */}
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
          We couldn't load listings. Check your connection.
        </div>
      ) : listings.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {listings.map((item) => (
            <ListingCard key={item._id} listing={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="Nothing here yet."
          description="Try a different search or clear a filter. Have something useful to pass on? Start the first listing for your campus."
          action={
            <Link href="/sell">
              <Button className="mt-2">List an item</Button>
            </Link>
          }
        />
      )}
    </main>
  );
}
