import mongoose from "mongoose";
import ConnectDB from "./db/index.js";
import { Product } from "./models/product.models.js";

// =========================================================================
// 🛒 40+ CURATED PRODUCTS FOR MONGODB
// =========================================================================
const initialProducts = [
  // --- Electronics ---
  {
    title: "UltraWide Pro Curved Display (34-inch)",
    category: "Electronics",
    price: 699.99,
    stock: 24,
    sku: "DISP-34-CRV",
    rating: 4.8,
    description: "WQHD 3440x1440 curved IPS monitor with 144Hz refresh rate, USB-C 90W power delivery, and HDR400.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Noise-Cancelling Studio Headphones Gen 3",
    category: "Electronics",
    price: 349.0,
    stock: 45,
    sku: "AUD-HDPH-NC3",
    rating: 4.9,
    description: "Over-ear active noise-cancelling headphones with 40-hour battery life and lossless audio codec support.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Thunderbolt 4 Quad-Display Docking Hub",
    category: "Electronics",
    price: 279.99,
    stock: 19,
    sku: "DOC-TB4-QUAD",
    rating: 4.8,
    description: "Universal 16-in-1 docking station supporting quad 4K displays, 2.5G Ethernet, and 100W PD charging.",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "4K Ultra HD Streaming Webcam with Ring Light",
    category: "Electronics",
    price: 129.99,
    stock: 35,
    sku: "CAM-4K-STRM",
    rating: 4.7,
    description: "Sony Starvis sensor with auto-focus, stereo noise-reduction microphones, and magnetic privacy cover.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Portable Bluetooth Waterproof Speaker",
    category: "Electronics",
    price: 89.99,
    stock: 50,
    sku: "AUD-SPK-WTR",
    rating: 4.6,
    description: "IP67 dust & waterproof portable outdoor speaker with deep punchy bass and 24h playtime.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Pro Creator 15.6-inch OLED Laptop",
    category: "Electronics",
    price: 1499.0,
    stock: 10,
    sku: "LAP-PRO-156",
    rating: 4.9,
    description: "Intel Core Ultra 9 processor, 32GB RAM, 1TB NVMe SSD, and factory calibrated OLED display.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Mirrorless 4K Vlogging & Cinema Camera",
    category: "Electronics",
    price: 899.0,
    stock: 12,
    sku: "CAM-VLOG-4K",
    rating: 4.8,
    description: "26MP APS-C sensor with 5-axis in-body stabilization, real-time eye AF, and flip-out LCD touchscreen.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "10.9-inch Liquid Retina Tablet 256GB",
    category: "Electronics",
    price: 599.0,
    stock: 28,
    sku: "TAB-RET-256",
    rating: 4.8,
    description: "All-screen design with True Tone display, Wi-Fi 6, USB-C, and support for magnetic precision stylus.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Wireless ANC Earbuds with Spatial Audio",
    category: "Electronics",
    price: 179.99,
    stock: 60,
    sku: "AUD-EAR-SPAT",
    rating: 4.7,
    description: "Custom dynamic drivers with adaptive noise cancellation, transparency mode, and wireless charging case.",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "27-inch 240Hz Fast IPS Esports Gaming Monitor",
    category: "Electronics",
    price: 449.0,
    stock: 16,
    sku: "DISP-27-240",
    rating: 4.9,
    description: "0.5ms response time, NVIDIA G-Sync compatible, HDR600, with height and pivot adjustable ergonomic stand.",
    image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Portable Power Bank 25,000mAh 100W PD",
    category: "Electronics",
    price: 79.99,
    stock: 40,
    sku: "PWR-BNK-100W",
    rating: 4.7,
    description: "Airline approved high-capacity battery bank capable of charging laptops, phones, and tablets simultaneously.",
    image: "https://images.unsplash.com/photo-1609592426867-eb953e5e4085?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Compact 4K Drone with Gimbal Stabilizer",
    category: "Electronics",
    price: 529.0,
    stock: 9,
    sku: "DRN-4K-STBL",
    rating: 4.6,
    description: "Under 249g ultralight folding drone with 31-min flight time, level 5 wind resistance, and 4K HDR video.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Smart Wi-Fi 6E Tri-Band Mesh Router",
    category: "Electronics",
    price: 219.0,
    stock: 22,
    sku: "NET-RTR-WF6E",
    rating: 4.8,
    description: "Up to 5400 sq. ft. seamless coverage with 5.4 Gbps total throughput and WPA3 enterprise security.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
  },

  // --- Furniture ---
  {
    title: "Ergonomic Mesh Task Chair Elite",
    category: "Furniture",
    price: 429.5,
    stock: 12,
    sku: "FURN-CHR-MSH",
    rating: 4.9,
    description: "Breathable Italian mesh task chair with 4D armrests, dynamic lumbar support, and pneumatic lift.",
    image: "https://images.unsplash.com/photo-1580481077195-c840f42b87e2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Smart Dual Motor Standing Desk 60x30",
    category: "Furniture",
    price: 549.0,
    stock: 8,
    sku: "DSK-STND-6030",
    rating: 4.6,
    description: "Dual motor electric standing desk with 4 memory presets, collision detection, and cable management tray.",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Solid Oak Minimalist Monitor Stand Riser",
    category: "Furniture",
    price: 75.0,
    stock: 30,
    sku: "FURN-OAK-MNT",
    rating: 4.7,
    description: "Handcrafted natural American oak desk shelf with integrated cork feet and keyboard stowage space.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Modern Scandinavian Bookshelf 5-Tier",
    category: "Furniture",
    price: 249.0,
    stock: 14,
    sku: "FURN-BKSH-5T",
    rating: 4.8,
    description: "Architectural ladder shelf made of FSC certified birch wood and matte white powdered metal frames.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Heavy-Duty Dual Gas-Spring Monitor Arm",
    category: "Furniture",
    price: 89.0,
    stock: 25,
    sku: "FURN-MNT-ARM2",
    rating: 4.7,
    description: "Full motion articulating arms supporting monitors up to 32 inches and 19.8 lbs each with cable routing.",
    image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Reclining Top-Grain Leather Executive Chair",
    category: "Furniture",
    price: 389.0,
    stock: 7,
    sku: "FURN-CHR-LTHR",
    rating: 4.8,
    description: "Supple genuine leather upholstery with high-density sponge padding, 135-degree recline, and footrest.",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Industrial 3-Drawer Under-Desk File Cabinet",
    category: "Furniture",
    price: 139.99,
    stock: 18,
    sku: "FURN-CAB-UND",
    rating: 4.5,
    description: "Lockable steel mobile pedestal cabinet with 360-degree casters and anti-tilt mechanism.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Ambient Screenbar LED Monitor Lamp",
    category: "Furniture",
    price: 69.0,
    stock: 45,
    sku: "FURN-LMP-SCRN",
    rating: 4.8,
    description: "Zero screen glare asymmetrical optical design with auto-dimming ambient light sensor and touch controls.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Solid Walnut Coffee & Side Table",
    category: "Furniture",
    price: 319.0,
    stock: 11,
    sku: "FURN-TBL-WLNT",
    rating: 4.6,
    description: "Live-edge solid walnut tabletop paired with geometric cast iron legs finished with natural wax oil.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80",
  },

  // --- Accessories ---
  {
    title: "Wireless Mechanical Keyboard Pro (Hot-Swap)",
    category: "Accessories",
    price: 159.0,
    stock: 5,
    sku: "KB-MECH-WRL",
    rating: 4.7,
    description: "Compact 75% mechanical keyboard with tactile switches, RGB per-key backlighting, and Bluetooth 5.2.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Precision Ergonomic Wireless Mouse",
    category: "Accessories",
    price: 89.5,
    stock: 32,
    sku: "MOU-ERG-PRC",
    rating: 4.8,
    description: "Ergonomic sculpted shape with thumb wheel, MagSpeed electromagnetic scroll, and 8K DPI sensor.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Full Desk Premium Leather Desk Mat (90x40cm)",
    category: "Accessories",
    price: 38.0,
    stock: 55,
    sku: "ACC-MAT-LTHR",
    rating: 4.7,
    description: "Waterproof microfiber leather desk blotter with anti-slip suede base and smooth mouse glide surface.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "3-in-1 Magnetic Fast Wireless Charging Station",
    category: "Accessories",
    price: 69.99,
    stock: 42,
    sku: "ACC-CHG-3IN1",
    rating: 4.8,
    description: "Charges phone, smartwatch, and wireless earbuds concurrently with 15W high-efficiency Qi2 induction.",
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Braided 100W USB-C to USB-C Cable (6.6ft)",
    category: "Accessories",
    price: 19.99,
    stock: 80,
    sku: "ACC-CBL-100W",
    rating: 4.6,
    description: "Reinforced aramid fiber braided cable with E-marker chip supporting 480Mbps data and 100W charging.",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Anodized Aluminum Vertical Laptop Stand",
    category: "Accessories",
    price: 42.0,
    stock: 26,
    sku: "ACC-STND-VERT",
    rating: 4.8,
    description: "CNC machined adjustable dock that keeps laptops upright in clamshell mode to maximize desktop area.",
    image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Water-Resistant Commuter Tech Backpack 22L",
    category: "Accessories",
    price: 110.0,
    stock: 20,
    sku: "ACC-BPK-COMM",
    rating: 4.9,
    description: "Cordura ballistic nylon with padded 16-inch laptop pocket, quick-access passport pouch, and YKK zippers.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Custom Coiled Mechanical Keyboard Cable",
    category: "Accessories",
    price: 28.0,
    stock: 35,
    sku: "ACC-CBL-COIL",
    rating: 4.7,
    description: "Paracord double-sleeved coil with detachable 4-pin GX12 aviator connector for mechanical keyboards.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Ergonomic Memory Foam Keyboard Wrist Rest",
    category: "Accessories",
    price: 24.99,
    stock: 45,
    sku: "ACC-WRST-REST",
    rating: 4.5,
    description: "Slow-rebound memory foam wrapped in breathable lycra to alleviate carpal tunnel and wrist strain.",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b909?w=800&auto=format&fit=crop&q=80",
  },

  // --- Lifestyle & Wellness ---
  {
    title: "Single-Origin Ethiopian Yirgacheffe Beans (1kg)",
    category: "Lifestyle",
    price: 26.5,
    stock: 65,
    sku: "LFS-COF-ETH",
    rating: 4.9,
    description: "Washed whole bean Arabica coffee featuring floral jasmine notes, bergamot sweetness, and lemon finish.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Stainless Steel Vacuum Insulated Tumbler 32oz",
    category: "Lifestyle",
    price: 34.99,
    stock: 50,
    sku: "LFS-FLK-32OZ",
    rating: 4.8,
    description: "Double-wall vacuum insulation keeps ice cold for up to 24 hours and hot coffee steaming for 12 hours.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Smart Temperature Control Heated Ceramic Mug",
    category: "Lifestyle",
    price: 129.0,
    stock: 15,
    sku: "LFS-MUG-SMT",
    rating: 4.6,
    description: "Maintains your preferred coffee temperature (120F - 145F) for 1.5 hours on battery or all day on coaster.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "True HEPA H13 Air Purifier for Home & Office",
    category: "Lifestyle",
    price: 149.99,
    stock: 22,
    sku: "LFS-AIR-HEPA",
    rating: 4.9,
    description: "Captures 99.97% of airborne dust, smoke, and pollen with quiet 24dB sleep mode and air quality indicator.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Ultrasonic Ceramic Essential Oil Aroma Diffuser",
    category: "Lifestyle",
    price: 39.99,
    stock: 38,
    sku: "LFS-ARO-DIFF",
    rating: 4.6,
    description: "Whisper-quiet ultrasonic mist technology with warm ambient night light and auto-shutoff safety timer.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Precision Electric Gooseneck Pour-Over Kettle",
    category: "Lifestyle",
    price: 79.0,
    stock: 20,
    sku: "LFS-KTL-ELEC",
    rating: 4.8,
    description: "Counterbalanced handle with slender curved spout, 1-degree temp accuracy, and 60-minute keep-warm mode.",
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Smart Fitness & Sleep Tracker Band Pro",
    category: "Lifestyle",
    price: 89.0,
    stock: 30,
    sku: "LFS-FIT-BAND",
    rating: 4.7,
    description: "Monitors heart rate, blood oxygen, REM sleep cycles, and daily workout metrics with 14-day battery life.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Ergonomic High-Density Anti-Fatigue Desk Mat",
    category: "Lifestyle",
    price: 49.99,
    stock: 28,
    sku: "LFS-MAT-FATG",
    rating: 4.7,
    description: "Multi-textured therapeutic standing mat engineered to stimulate blood flow and relieve lumbar tension.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
  },
  {
    title: "Minimalist Double-Walled Borosilicate Glass Mug",
    category: "Lifestyle",
    price: 22.0,
    stock: 45,
    sku: "LFS-MUG-GLSS",
    rating: 4.8,
    description: "Hand-blown heat resistant glass creating an optical floating drink effect while staying cool to the touch.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
  },
];

const seedDatabase = async () => {
  try {
    await ConnectDB();
    console.log("\n Connected to MongoDB database successfully.");

    // Pass --clean or --fresh to wipe collection before inserting: npm run seed -- --clean
    const isClean = process.argv.includes("--clean") || process.argv.includes("--fresh");
    if (isClean) {
      await Product.deleteMany({});
      console.log(" Cleaned existing products from MongoDB.");
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of initialProducts) {
      const filter = item.sku ? { sku: item.sku } : { title: item.title };
      const existing = await Product.findOne(filter);

      if (existing) {
        Object.assign(existing, item);
        await existing.save();
        updatedCount++;
      } else {
        await Product.create(item);
        insertedCount++;
      }
    }

    console.log(`\n Successfully synced products into MongoDB!`);
    console.log(`   - New products inserted: ${insertedCount}`);
    console.log(`   - Existing products updated: ${updatedCount}`);

    const totalCount = await Product.countDocuments();
    console.log(`   - Total products in database: ${totalCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
