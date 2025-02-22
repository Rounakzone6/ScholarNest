import {
  addReview,
  countReviews,
  getProductReviews,
  getReviews,
} from "../controllers/reviewsController.js";
import express from "express";

const reviewsRouter = express.Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/get/count", countReviews);
reviewsRouter.get("/:id", getProductReviews);

reviewsRouter.post("/add", addReview);

export default reviewsRouter;
