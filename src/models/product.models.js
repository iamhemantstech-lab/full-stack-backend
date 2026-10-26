import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      default: "Electronics",
      index: true,
    },
    image: {
      type: String, // Cloudinary secure URL or image URL
      required: [true, "Product image is required"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, "Rating cannot be lower than 0"],
      max: [5, "Rating cannot be higher than 5"],
    },
    stock: {
      type: Number,
      default: 10,
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'name' so frontend code expecting product.name or product.title both work seamlessly
ProductSchema.virtual("name").get(function () {
  return this.title;
});
ProductSchema.virtual("name").set(function (val) {
  this.title = val;
});

// Auto-generate SKU and calculate status before saving
ProductSchema.pre("save", function (next) {
  if (!this.sku) {
    const prefix = (this.category || "PRD").slice(0, 3).toUpperCase();
    const randomCode = Math.floor(100 + Math.random() * 900);
    this.sku = `SKU-${prefix}-${randomCode}`;
  }

  if (this.stock <= 0) {
    this.status = "Out of Stock";
  } else if (this.stock <= 5) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }

  if (typeof next === "function") next();
});

export const Product = mongoose.model("Product", ProductSchema);
