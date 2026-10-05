import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";

import Campus from "./models/campusModel.js";
import Category from "./models/categoryModel.js";
import User from "./models/userModel.js";
import Listing from "./models/listingModel.js";

const seedDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/ScholarNest`);
    console.log("Connected to MongoDB");

    // Clear existing
    await Campus.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Listing.deleteMany();

    // 1. Campus
    const campus = await Campus.create({
      university: "Test University",
      campusName: "Main Campus",
      city: "Test City",
      state: "Test State",
      emailDomains: ["test.edu"],
    });

    // 2. Category
    const category = await Category.create({
      name: "Electronics",
      slug: "electronics",
      description: "Electronic items",
    });

    // 3. User
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      name: "Test User",
      username: "testuser",
      email: "test@test.edu",
      phone: "1234567890",
      password: hashedPassword,
      campus: campus._id,
      campusName: campus.campusName,
      verificationStatus: "verified",
      isEmailVerified: true,
      role: "student",
    });

    // 4. Listings
    await Listing.create([
      {
        sellerId: user._id,
        title: "Used Laptop",
        description: "A great laptop for coding.",
        price: 30000,
        categoryId: category._id,
        categoryName: category.name,
        condition: "Good",
        campusId: campus._id,
        campus: campus.campusName,
        status: "published",
        publishedAt: new Date(),
        images: [],
      },
      {
        sellerId: user._id,
        title: "Calculus Textbook",
        description: "Slightly worn out but readable.",
        price: 500,
        categoryId: category._id,
        categoryName: category.name,
        condition: "Fair",
        campusId: campus._id,
        campus: campus.campusName,
        status: "published",
        publishedAt: new Date(),
        images: [],
      },
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding DB:", error);
    process.exit(1);
  }
};

seedDB();
