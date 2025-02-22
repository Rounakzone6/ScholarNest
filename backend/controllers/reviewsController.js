import ProductReviews from "../models/productReviews.js";

const getReviews = async (req, res) => {
  let reviews = [];
  try {
    if (
      req.query.productId !== undefined &&
      req.query.productId !== null &&
      req.query.productId !== ""
    ) {
      reviews = await ProductReviews.find({ productId: req.query.productId });
    } else {
      reviews = await ProductReviews.find();
    }
    if (!reviews) {
      return res.json({
        success: false,
      });
    }
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const countReviews = async (req, res) => {
  try {
    const productsReviews = await ProductReviews.countDocuments();
    if (!productsReviews) {
      return res.json({
        success: false,
      });
    } else {
      res.send({ productsReviews: productsReviews });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const productReview = await ProductReviews.findById(req.params.id);
    console.log(productReview);

    // if (!review) {
    //   return res.json({
    //     success: false,
    //     message: "The review with the given ID was not found.",
    //   });
    // }
    // return res.send(review);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, customerId, customerRating, customerName, review } =
      req.body;

    if (
      !productId ||
      !customerId ||
      !customerName ||
      !customerRating ||
      !review
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const newReview = new ProductReviews({
      productId,
      customerId,
      customerName,
      customerRating,
      review,
    });
    await newReview.save();

    res.json({ success: true, message: "Review added successfully" });
    // let review = new ProductReviews({
    //   customerId: req.body.customerId,
    //   customerName: req.body.customerName,
    //   review: req.body.review,
    //   customerRating: req.body.customerRating,
    //   productId: req.body.productId,
    // });

    // if (!review) {
    //   return res.json({
    //     success: false,
    //     error: err,
    //   });
    // }
    // review = await review.save();
    // res.json({
    //   success: true,
    //   review,
    // });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getReviews, countReviews, getProductReviews, addReview };
