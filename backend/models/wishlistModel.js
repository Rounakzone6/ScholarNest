import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

// One save per user per listing
wishlistSchema.index({ userId: 1, listingId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1, createdAt: -1 });
wishlistSchema.index({ listingId: 1 }); // for counting saves

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
