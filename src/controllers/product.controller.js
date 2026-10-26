import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileUploadOnCloudinary } from "../utils/cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    name,
    description,
    price,
    category,
    rating,
    stock,
    sku,
    image: bodyImageUrl,
  } = req.body;

  const productTitle = (title || name || "").trim();
  const productDescription = (description || "").trim();
  const productPrice = Number(price);

  if (!productTitle) {
    throw new ApiError(400, "Product title/name is required");
  }

  if (!productDescription) {
    throw new ApiError(400, "Product description is required");
  }

  if (price === undefined || isNaN(productPrice) || productPrice < 0) {
    throw new ApiError(400, "Valid product price (>= 0) is required");
  }

  // Handle product image: from uploaded file (via Multer + Cloudinary) or from direct URL
  let imageUrl = (bodyImageUrl || "").trim();
  const imageLocalPath = req.file?.path || req.files?.image?.[0]?.path;

  if (imageLocalPath) {
    const cloudinaryResponse = await fileUploadOnCloudinary(imageLocalPath);
    if (!cloudinaryResponse?.secure_url && !cloudinaryResponse?.url) {
      throw new ApiError(500, "Failed to upload product image to Cloudinary");
    }
    imageUrl = cloudinaryResponse.secure_url || cloudinaryResponse.url;
  }

  // Default fallback image if none provided
  if (!imageUrl) {
    imageUrl =
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80";
  }

  const newProduct = await Product.create({
    title: productTitle,
    description: productDescription,
    price: productPrice,
    category: (category || "Electronics").trim(),
    image: imageUrl,
    rating:
      rating !== undefined && !isNaN(Number(rating)) ? Number(rating) : 4.5,
    stock:
      stock !== undefined && !isNaN(Number(stock))
        ? Math.max(0, parseInt(stock, 10))
        : 10,
    sku: sku?.trim() || undefined,
    createdBy: req.user?._id || undefined,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const limitNum = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 5));
  const offsetNum = Math.max(0, parseInt(req.query.offset, 10) || 0);

  const filter = {};
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
      { category: { $regex: escapedSearch, $options: "i" } },
      { sku: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip(offsetNum)
    .limit(limitNum)
    .lean()
    .exec();

  const total = await Product.countDocuments(filter).exec();

  const response = {
    products,
    pagination: {
      total,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + products.length < total,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Products retrieved successfully"));
});


const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }

  if (!product) {
    product = await Product.findOne({ sku: id.toUpperCase() });
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product details fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const {
    title,
    name,
    description,
    price,
    category,
    rating,
    stock,
    sku,
    image: bodyImageUrl,
  } = req.body;

  if (title || name) product.title = (title || name).trim();
  if (description) product.description = description.trim();
  if (price !== undefined && !isNaN(Number(price)))
    product.price = Number(price);
  if (category) product.category = category.trim();
  if (rating !== undefined && !isNaN(Number(rating)))
    product.rating = Number(rating);
  if (sku) product.sku = sku.trim().toUpperCase();

  if (stock !== undefined && !isNaN(Number(stock))) {
    product.stock = Math.max(0, parseInt(stock, 10));
    if (product.stock <= 0) product.status = "Out of Stock";
    else if (product.stock <= 5) product.status = "Low Stock";
    else product.status = "In Stock";
  }

  // Handle image update if new file provided
  const imageLocalPath = req.file?.path || req.files?.image?.[0]?.path;
  if (imageLocalPath) {
    const cloudinaryResponse = await fileUploadOnCloudinary(imageLocalPath);
    if (cloudinaryResponse?.secure_url || cloudinaryResponse?.url) {
      product.image = cloudinaryResponse.secure_url || cloudinaryResponse.url;
    }
  } else if (bodyImageUrl && bodyImageUrl.trim() !== "") {
    product.image = bodyImageUrl.trim();
  }

  const updatedProduct = await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

const seedProducts = asyncHandler(async (req, res) => {
  const initialProducts = [
    {
      title: "UltraWide Pro Curved Display (34-inch)",
      category: "Electronics",
      price: 699.99,
      stock: 24,
      sku: "DISP-34-CRV",
      rating: 4.8,
      description:
        "WQHD 3440x1440 curved IPS monitor with 144Hz refresh rate, USB-C 90W power delivery, and HDR400.",
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Ergonomic Mesh Task Chair Elite",
      category: "Furniture",
      price: 429.5,
      stock: 12,
      sku: "FURN-CHR-MSH",
      rating: 4.9,
      description:
        "Breathable Italian mesh task chair with 4D armrests, dynamic lumbar support, and pneumatic lift.",
      image:
        "https://images.unsplash.com/photo-1580481077195-c840f42b87e2?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Wireless Mechanical Keyboard Pro (Hot-Swap)",
      category: "Accessories",
      price: 159.0,
      stock: 5,
      sku: "KB-MECH-WRL",
      rating: 4.7,
      description:
        "Compact 75% mechanical keyboard with tactile switches, RGB per-key backlighting, and Bluetooth 5.2.",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Noise-Cancelling Studio Headphones Gen 3",
      category: "Electronics",
      price: 349.0,
      stock: 45,
      sku: "AUD-HDPH-NC3",
      rating: 4.9,
      description:
        "Over-ear active noise-cancelling headphones with 40-hour battery life and lossless audio codec support.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Smart Dual Motor Standing Desk 60x30",
      category: "Furniture",
      price: 549.0,
      stock: 8,
      sku: "DSK-STND-6030",
      rating: 4.6,
      description:
        "Dual motor electric standing desk with 4 memory presets, collision detection, and cable management tray.",
      image:
        "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Thunderbolt 4 Quad-Display Docking Hub",
      category: "Electronics",
      price: 279.99,
      stock: 19,
      sku: "DOC-TB4-QUAD",
      rating: 4.8,
      description:
        "Universal 16-in-1 docking station supporting quad 4K displays, 2.5G Ethernet, and 100W PD charging.",
      image:
        "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const existingCount = await Product.countDocuments();
  if (existingCount > 0 && req.query.force !== "true") {
    const products = await Product.find().limit(20);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products, totalCount: existingCount },
          "Products already exist in database"
        )
      );
  }

  if (req.query.force === "true") {
    await Product.deleteMany({});
  }

  const seeded = await Product.insertMany(initialProducts);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        seeded,
        `Successfully seeded ${seeded.length} products into database`
      )
    );
});

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
};
