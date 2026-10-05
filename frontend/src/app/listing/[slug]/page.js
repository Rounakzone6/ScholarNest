import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Clock, Tag, ChevronRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

// Interactive Client Component wrapper for the Sidebar
import ListingActions from "./ListingActions";
import ListingGallery from "./ListingGallery";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const id = slug.split('-').pop();
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${backendUrl}/api/listings/${id}`, { cache: "no-store" });
    if (!res.ok) return { title: "Listing Not Found" };
    
    const { listing } = await res.json();
    const images = listing.images || ["/og-default.jpg"];
    
    return {
      title: `${listing.title} | ${listing.campus}`,
      description: listing.description.substring(0, 160),
      openGraph: {
        type: "website",
        title: `${listing.title} — ₹${listing.price} | ScholarNest`,
        description: `Buy a used ${listing.title} in ${listing.condition.toLowerCase()} condition from a student at ${listing.campus}.`,
        images: [{ url: images[0] }]
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/listing/${slug}`,
      }
    };
  } catch (e) {
    return { title: "Listing Error" };
  }
}

export default async function ListingPage({ params }) {
  const { slug } = await params;
  const id = slug.split('-').pop();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://scholarnest.com";
  
  let listing = null;
  let related = [];

  try {
    const res = await fetch(`${backendUrl}/api/listings/${id}`, { cache: "no-store" });
    if (!res.ok) return notFound();
    
    const data = await res.json();
    listing = data.listing;

    // Fetch related
    if (listing.category || listing.categoryName) {
      const rec = await fetch(`${backendUrl}/api/listings?category=${encodeURIComponent(listing.categoryName || listing.category)}`, { cache: "no-store" });
      if (rec.ok) {
        const recData = await rec.json();
        related = (recData.listings || []).filter(x => x._id !== listing._id).slice(0, 4);
      }
    }
  } catch (e) {
    return notFound();
  }

  if (!listing) return notFound();

  const seller = listing.sellerId || {};
  const images = listing.images || ["/og-default.jpg"];

  // Generate Structured Data (Product + Breadcrumb)
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": listing.title,
    "image": images,
    "description": listing.description,
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/listing/${slug}`,
      "priceCurrency": "INR",
      "price": listing.price,
      "availability": listing.status === "published" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/UsedCondition"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Browse",
      "item": `${siteUrl}/browse`
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": listing.categoryName || listing.category,
      "item": `${siteUrl}/browse?category=${encodeURIComponent(listing.categoryName || listing.category)}`
    }, {
      "@type": "ListItem",
      "position": 4,
      "name": listing.title,
      "item": `${siteUrl}/listing/${slug}`
    }]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="mx-auto max-w-6xl py-6 pb-28 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/browse" className="text-primary-600 hover:text-primary-700 hover:underline">
            Browse
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/browse?category=${encodeURIComponent(listing.categoryName || listing.category)}`} className="text-primary-600 hover:text-primary-700 hover:underline">
            {listing.categoryName || listing.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate text-slate-900">{listing.title}</span>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_.8fr]">
          {/* Left Column: Images & Details */}
          <section className="flex flex-col gap-8">
            <ListingGallery images={images} title={listing.title} />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h1 className="heading text-xl font-bold text-slate-900">About this item</h1>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-600">
                {listing.description}
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-y-6 border-t border-slate-100 pt-6 sm:grid-cols-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Tag className="h-3.5 w-3.5" /> Condition</p>
                  <p className="mt-1 font-bold text-slate-900">{listing.condition}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Category</p>
                  <p className="mt-1 font-bold text-slate-900">{listing.categoryName || listing.category}</p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><MapPin className="h-3.5 w-3.5" /> Campus</p>
                  <p className="mt-1 font-bold text-slate-900">{listing.campus}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Pickup Preference</p>
                  <p className="mt-1 font-bold text-slate-900">{listing.pickupPreference || "Campus meetup"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Sticky Sidebar Checkout */}
          <aside className="lg:sticky lg:top-24">
            <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={listing.condition === "Like New" ? "success" : "default"}>
                    {listing.condition}
                  </Badge>
                  {listing.negotiable && <Badge variant="primary">Negotiable</Badge>}
                </div>
                <h2 className="heading mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                  {listing.title}
                </h2>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    ₹{Number(listing.price).toLocaleString("en-IN")}
                  </span>
                  {listing.originalPrice > listing.price && (
                    <span className="text-base font-medium text-slate-400 line-through">
                      ₹{Number(listing.originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {listing.locationArea ? `${listing.locationArea} · ` : ""}{listing.campus}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-500">
                  <Clock className="h-4 w-4" />
                  Listed {new Date(listing.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Seller Info */}
              <div className="flex items-center gap-4">
                <Avatar src={seller.avatar} fallback={seller.name?.[0]} size="lg" />
                <div>
                  <p className="flex items-center gap-1.5 font-bold text-slate-900">
                    {seller.name || "Student seller"} 
                    {seller.verificationStatus === "verified" && <ShieldCheck className="h-4 w-4 text-primary-600" aria-label="Verified" />}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    {seller.campus || listing.campus}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Client Interactive Actions (Messaging, Reserve, Save) */}
              <ListingActions listingId={listing._id} status={listing.status} />
              
              <div className="mt-2 rounded-2xl bg-primary-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                  <p className="text-xs font-medium leading-relaxed text-primary-900">
                    <strong>Safety Tip:</strong> Meet in a public campus location during daytime. Never share your passwords or OTPs.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Listings */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-slate-100 pt-12">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="heading text-2xl font-extrabold text-slate-900">Similar finds</h2>
              </div>
              <Link href="/browse" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline">
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map(item => <ListingCard key={item._id} listing={item} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
