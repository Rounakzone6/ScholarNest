import Link from "next/link";
import { Search as SearchIcon, MapPin, ShieldCheck } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // Convert slug to readable campus name, e.g., bbd-university-lucknow -> Bbd University Lucknow
  const campusName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `Second-Hand Marketplace at ${campusName} | ScholarNest`,
    description: `Browse used books, electronics, hostel essentials and other affordable second-hand items from students at ${campusName}.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/campus/${slug}`,
    }
  };
}

export default async function CampusPage({ params }) {
  const { slug } = await params;
  const campusName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarnest.com";
  
  let listings = [];
  let error = false;

  try {
    const res = await fetch(`${backendUrl}/api/listings?campus=${encodeURIComponent(campusName)}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      listings = data.listings || [];
    } else {
      error = true;
    }
  } catch (e) {
    error = true;
  }

  // Generate Structured Data for Campus Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Second-Hand Marketplace at ${campusName}`,
    description: `Browse affordable second-hand items from students at ${campusName}.`,
    url: `${siteUrl}/campus/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listings.map((listing, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteUrl}/listing/${listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${listing._id}`
      }))
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto max-w-[1440px] py-8 pb-28 md:py-12">
        <div className="mb-10 rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
          <div className="flex max-w-3xl flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-emerald-300">
              <MapPin className="h-3 w-3" />
              Verified Campus Marketplace
            </div>
            <h1 className="heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Second-Hand Marketplace at {campusName}
            </h1>
            <p className="mt-2 text-lg text-slate-300">
              Buy and sell used books, electronics, and hostel essentials locally. Meet safely on campus and save money.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sell">
                <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700">Sell to students here</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {listings.length} active {listings.length === 1 ? "listing" : "listings"} at {campusName}
          </h2>
        </div>

        {/* Results Grid */}
        {error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            We couldn't load the campus marketplace. Check your connection.
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
            title="Be the first to sell here."
            description={`There are no public listings at ${campusName} right now. Start your campus marketplace by passing on something useful.`}
            action={
              <Link href="/sell">
                <Button className="mt-2">List an item</Button>
              </Link>
            }
          />
        )}
      </main>
    </>
  );
}
