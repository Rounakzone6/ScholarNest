import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "" },
    description: { type: String, default: "" },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ parentId: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ active: 1, order: 1 });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
