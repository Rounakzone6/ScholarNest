import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Tag, 
  ChevronRight, 
  Share, 
  Heart, 
  Flag 
} from "lucide-react";
import { ShopContext } from "../context/ShopContext";

import ListingCard from "../components/ListingCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import SEO from "../components/SEO";

const ListingDetail = () => {
  const { listingId } = useParams();
  const { backendUrl, token, navigate } = useContext(ShopContext);

  const [listing, setListing] = useState(null);
  const [related, setRelated] = useState([]);
  const [imageIdx, setImageIdx] = useState(0);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    axios.get(`${backendUrl}/api/listings/${listingId}`)
      .then(async ({ data }) => {
        if (!active) return;
        setListing(data.listing);
        setLoading(false);

        try {
          const rec = await axios.get(`${backendUrl}/api/listings`, { 
            params: { category: data.listing.categoryName || data.listing.category } 
          });
          if (active) {
            setRelated((rec.data.listings || []).filter(x => x._id !== listingId).slice(0, 4));
          }
        } catch (err) {
          console.error("Failed to load related listings", err);
        }
      })
      .catch(e => {
        if (active) {
          setError(e.response?.data?.message || "This listing could not be loaded.");
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [backendUrl, listingId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl animate-pulse py-8 pb-28 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <Skeleton className="aspect-[4/3] rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <Skeleton className="h-16 w-1/3 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="mx-auto max-w-xl py-24 pb-32 text-center">
        <ErrorState title="Listing unavailable" description={error} onRetry={() => navigate("/browse")} />
      </main>
    );
  }

  const seller = listing.sellerId || {};
  
  const handleMessage = () => toast.info("Messaging will be available soon.");
  const handleSave = () => token ? toast.info("Saved listings coming soon.") : navigate("/login");
  const handleReport = () => toast.info("Reports will be available soon.");
  
  const handleReserve = async () => {
    if (!token) return navigate("/login");
    setReserving(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/orders/reserve`,
        { listingId: listing._id },
        { headers: { token } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not reserve this item.");
    } finally {
      setReserving(false);
    }
  };

  const shareUrl = window.location.href;
  const copyLink = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => toast.success("Link copied"));
    } else {
      toast.info(shareUrl);
    }
  };

  const images = listing.images || ["/vite.svg"];

  return (
    <main className="mx-auto max-w-6xl py-6 pb-28 md:py-10">
      <SEO 
        title={`${listing.title} | ${listing.campus}`} 
        description={listing.description.substring(0, 160)}
        image={images[0]}
        type="product"
      />
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link to="/browse" className="text-primary-600 hover:text-primary-700 hover:underline">
          Browse
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900">{listing.categoryName || listing.category}</span>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_.8fr]">
        
        {/* Left Column: Images & Details */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
              <img
                src={images[imageIdx]}
                alt={`${listing.title} - photo ${imageIdx + 1}`}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-4 right-4 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                {imageIdx + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIdx(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      imageIdx === i ? "border-primary-600 ring-4 ring-primary-500/20" : "border-transparent hover:opacity-80"
                    }`}
                  >
                    <img src={src} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="heading text-xl font-bold text-slate-900">About this item</h2>
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
              <h1 className="heading mt-4 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                {listing.title}
              </h1>
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

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={handleMessage}
                className="w-full gap-2"
              >
                <MessageCircle className="h-5 w-5" /> Message seller
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleReserve}
                disabled={reserving || listing.status !== "published"}
                isLoading={reserving}
                className="w-full"
              >
                {listing.status === "published" ? "Reserve & Arrange Pickup" : `Item ${listing.status}`}
              </Button>
              <p className="text-center text-xs font-medium text-slate-500">
                No money moves until you meet the seller.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-slate-50" onClick={handleSave}>
                <Heart className="h-5 w-5" />
                <span className="text-[10px]">Save</span>
              </Button>
              <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-slate-50" onClick={copyLink}>
                <Share className="h-5 w-5" />
                <span className="text-[10px]">Share</span>
              </Button>
              <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={handleReport}>
                <Flag className="h-5 w-5" />
                <span className="text-[10px]">Report</span>
              </Button>
            </div>
            
            <div className="rounded-2xl bg-primary-50 p-4">
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
            <Link to="/browse" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline">
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map(item => <ListingCard key={item._id} listing={item} />)}
          </div>
        </section>
      )}
    </main>
  );
};

export default ListingDetail;
