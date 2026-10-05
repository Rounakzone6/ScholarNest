import mongoose from "mongoose";

const campusSchema = new mongoose.Schema(
  {
    university: { type: String, required: true, trim: true },
    campusName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    emailDomains: [{ type: String, lowercase: true, trim: true }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

campusSchema.index({ university: 1, campusName: 1 }, { unique: true });
campusSchema.index({ city: 1 });
campusSchema.index({ active: 1 });

const Campus = mongoose.models.Campus || mongoose.model("Campus", campusSchema);
export default Campus;
