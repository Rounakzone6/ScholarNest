import express from "express";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  createListing,
  getListing,
  listListings,
  moderateListing,
  moderationQueue,
  myListings,
} from "../controllers/listingController.js";

const router = express.Router();

// Public routes
router.get("/", listListings);
router.get("/:id", getListing);

// Protected routes (User)
router.get("/user/mine", userAuth, myListings);
router.post("/", userAuth, upload.fields([{ name: "images", maxCount: 6 }]), createListing);

// Protected routes (Admin)
router.get("/admin/moderation", adminAuth, moderationQueue);
router.post("/admin/moderate", adminAuth, moderateListing);

export default router;
