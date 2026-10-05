import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "./ui/Badge";
import { ShieldCheck } from "lucide-react";

const ListingCard = ({ listing }) => {
  const seller = listing.sellerId || {};
  const image = listing.images?.[0] || "/og-default.jpg";
  
  return (
    <Link 
      href={`/listing/${listing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${listing._id}`} 
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Image 
          src={image} 
          alt={listing.title} 
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Top Left Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <Badge variant="default" className="bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
            {listing.condition || "Pre-loved"}
          </Badge>
          {listing.status === "reserved" && (
            <Badge variant="warning" className="bg-amber-100/95 text-amber-800 shadow-sm backdrop-blur-sm">
              Reserved
            </Badge>
          )}
        </div>

        {/* Top Right Badges */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {listing.negotiable && (
            <Badge variant="success" className="bg-emerald-500/95 text-white shadow-sm backdrop-blur-sm">
              Negotiable
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[40px] text-[15px] font-bold leading-5 text-slate-900">
            {listing.title}
          </h3>
          <span className="shrink-0 text-base font-extrabold text-slate-900">
            ₹{Number(listing.price).toLocaleString("en-IN")}
          </span>
        </div>
        
        <p className="mb-4 text-xs font-medium text-slate-500">
          {listing.categoryName || listing.category} 
          <span className="mx-1.5 text-slate-300">•</span> 
          {listing.campus || "Campus"}
        </p>
        
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-xs font-semibold text-slate-600">
              {seller.name || "Student"}
            </span>
            {seller.verificationStatus === "verified" && (
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-label="Verified student" />
            )}
          </div>
          <span className="shrink-0 text-[11px] font-medium text-slate-400">
            {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "New"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
