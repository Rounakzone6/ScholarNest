import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search as SearchIcon } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

import ListingCard from "../components/ListingCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import SEO from "../components/SEO";

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

const Browse = () => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  const loadListings = () => {
    let active = true;
    setLoading(true);
    setError("");
    
    axios.get(`${backendUrl}/api/listings`, { params: Object.fromEntries(params.entries()) })
      .then(({ data }) => {
        if (active) {
          setListings(data.listings || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("We couldn't load listings. Check your connection and try again.");
          setLoading(false);
        }
      });
      
    return () => { active = false; };
  };

  useEffect(() => {
    return loadListings();
  }, [backendUrl, params]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    next.delete("page");
    setParams(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam("q", q.trim());
  };

  const handleClearFilters = () => {
    setParams({});
    setQ("");
  };

  return (
    <main className="mx-auto max-w-[1440px] py-8 pb-28 md:py-12">
      <SEO 
        title="Browse Items" 
        description="Find exactly what you need for your classes or dorm. Search by category, condition, and price in the ScholarNest marketplace."
      />
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
      <form onSubmit={handleSearch} className="mb-8 flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary-500">
        <div className="flex w-12 items-center justify-center text-slate-400">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          aria-label="Search listings"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search books, calculators, hostel essentials…"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-500 sm:text-base"
        />
        <Button type="submit" size="lg" className="px-6">
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          value={params.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          options={[
            { label: "All categories", value: "" },
            ...categories.map((c) => ({ label: c, value: c }))
          ]}
        />
        
        <Input
          placeholder="Filter by campus..."
          value={params.get("campus") || ""}
          onChange={(e) => updateParam("campus", e.target.value)}
        />
        
        <Select
          value={params.get("condition") || ""}
          onChange={(e) => updateParam("condition", e.target.value)}
          options={[
            { label: "Any condition", value: "" },
            ...conditions
          ]}
        />
        
        <Select
          value={params.get("sort") || "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
          options={sortOptions}
        />
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="font-bold text-slate-900">
          {loading ? "Finding listings…" : `${listings.length} ${listings.length === 1 ? "listing" : "listings"}`}
        </h2>
        {Array.from(params.entries()).length > 0 && (
          <button 
            onClick={handleClearFilters}
            className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Grid */}
      {error ? (
        <ErrorState description={error} onRetry={loadListings} />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="mt-4 h-4 w-2/3" />
              <Skeleton className="mt-2 h-4 w-1/3" />
            </div>
          ))}
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
            <Button onClick={() => navigate("/sell")} className="mt-2">
              List an item
            </Button>
          }
        />
      )}
    </main>
  );
};

export default Browse;
