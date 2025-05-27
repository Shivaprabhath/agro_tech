const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const User = require("../models/User");

// @route   POST api/products
// @desc    Create a new product
// @access  Private (farmers only)
router.post("/", auth, async (req, res) => {
  try {
    // Check if user is a farmer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can add products" });
    }

    const { title, description, price, quantity, unit, tradeOption, imageUrl } =
      req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      quantity,
      unit,
      tradeOption,
      imageUrl:
        imageUrl ||
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500",
      sellerId: req.user.id,
      sellerName: user.name,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (owner only)
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user owns this product
    if (product.sellerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this product" });
    }

    const { title, description, price, quantity, unit, tradeOption, imageUrl } =
      req.body;

    // Update fields
    if (title) product.title = title;
    if (description !== undefined) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (unit) product.unit = unit;
    if (tradeOption) product.tradeOption = tradeOption;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user owns this product
    if (product.sellerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this product" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/products/farmer
// @desc    Get current farmer's products
// @access  Private
router.get("/farmer/me", auth, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
