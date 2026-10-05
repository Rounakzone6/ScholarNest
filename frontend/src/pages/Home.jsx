import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import ListingCard from "../components/ListingCard";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import SEO from "../components/SEO";

const categories = [
  ["📚", "Books & Study Material"],
  ["💻", "Electronics"],
  ["🛏️", "Hostel Essentials"],
  ["🪑", "Furniture"],
  ["🚲", "Cycles & Vehicles"],
  ["🏸", "Sports"],
  ["🎒", "Stationery"],
  ["✳", "Other"],
];

const Home = () => {
  const { backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    axios
      .get(`${backendUrl}/api/listings`, { params: { page: 1 } })
      .then(({ data }) => {
        if (active) setListings(data.listings || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [backendUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  const fresh = listings.slice(0, 8);
  const under = listings.filter((item) => item.price <= 500).slice(0, 4);

  return (
    <main className="mx-auto max-w-[1440px] pb-24">
      <SEO 
        title="ScholarNest - The Trusted Student Marketplace" 
        description="Buy, sell, and discover useful second-hand products around your campus. Designed exclusively for students."
      />
      {/* Hero Section */}
      <section className="relative isolate -mx-4 overflow-hidden bg-slate-950 px-6 py-14 text-white sm:-mx-[5vw] sm:px-[7vw] sm:py-24 md:-mx-[7vw] lg:-mx-[9vw] lg:px-[9vw] lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-primary-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> 
            Student marketplace · Campus native
          </div>
          <h1 className="heading max-w-4xl text-[42px] font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Buy smarter. <br className="hidden sm:block" />
            <span className="text-primary-400">Pass it on.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Find affordable second-hand essentials from students around your campus. Good finds deserve another semester.
          </p>

          <form onSubmit={handleSearch} className="mt-10 flex max-w-2xl gap-2 rounded-2xl bg-white p-2 shadow-2xl">
            <div className="grid w-12 place-items-center text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search marketplace"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            />
            <Button type="submit" size="lg" className="px-6">Search</Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400">Try searching:</span>
            {["Engineering books", "Scientific Calculator", "Study lamp", "Cycle"].map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/browse?q=${encodeURIComponent(term)}`)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="heading text-2xl font-extrabold text-slate-900">Browse by category</h2>
          </div>
          <Link to="/browse" className="text-sm font-bold text-primary-600 hover:text-primary-700">All listings →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map(([icon, name]) => (
            <Link
              key={name}
              to={`/browse?category=${encodeURIComponent(name)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-50 text-2xl transition-transform group-hover:scale-110">
                {icon}
              </span>
              <span className="mt-3 text-center text-xs font-bold leading-tight text-slate-700 group-hover:text-primary-700">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh Listings */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="heading text-2xl font-extrabold text-slate-900">Fresh around campus</h2>
            <p className="mt-1 text-sm text-slate-500">New finds from your student community.</p>
          </div>
          <Link to="/browse" className="text-sm font-bold text-primary-600 hover:text-primary-700">Explore all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="mt-4 h-4 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : fresh.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {fresh.map((item) => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The first good find could be yours."
            description="There are no public listings yet. Start your campus marketplace by passing on something useful."
            action={<Button onClick={() => navigate("/sell")}>Sell the first item</Button>}
          />
        )}
      </section>

      {/* Budget section */}
      {under.length > 0 && (
        <section className="py-8">
          <div className="mb-6">
            <h2 className="heading text-2xl font-extrabold text-slate-900">Deals under ₹500</h2>
            <p className="mt-1 text-sm text-slate-500">Small budget, solid finds.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {under.map((item) => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="my-12 rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="heading text-3xl font-extrabold">A better way to find what you need.</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Find a useful thing", "Explore student listings nearby."],
                ["02", "Meet the student", "Agree on a fair price and public meetup."],
                ["03", "Give it another life", "Save money and keep good stuff moving."],
              ].map(([n, title, body]) => (
                <div key={n} className="relative">
                  <span className="text-5xl font-black text-white/10">{n}</span>
                  <h3 className="mt-2 text-lg font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => navigate("/sell")} variant="secondary" size="lg" className="w-full md:w-auto">
            Start selling
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;
