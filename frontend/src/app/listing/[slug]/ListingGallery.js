"use client";

import { useState } from "react";

export default function ListingGallery({ images, title }) {
  const [imageIdx, setImageIdx] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 ring-1 ring-slate-200">
        <img
          src={images[imageIdx]}
          alt={`${title} - photo ${imageIdx + 1}`}
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
  );
}
