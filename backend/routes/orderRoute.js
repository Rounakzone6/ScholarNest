import express from "express";
import userAuth from "../middleware/userAuth.js";
import { myOrders, reserveListing, updateOrder } from "../controllers/orderController.js";

const router = express.Router();

router.use(userAuth);
router.get("/mine", myOrders);
router.post("/reserve", reserveListing);
router.post("/update", updateOrder);

export default router;
