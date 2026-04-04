const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, brand } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      stock === undefined ||
      !sku ||
      !brand
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (
      typeof price !== "number" ||
      price <= 0 ||
      typeof stock !== "number" ||
      stock < 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Price and stock must be valid",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      sku,
      brand,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Could not save product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { price, stock } = req.body;

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res.status(400).json({
        success: false,
        error: "Price must be greater than zero",
      });
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return res.status(400).json({
        success: false,
        error: "Stock must be zero or more",
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Could not update product",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};
