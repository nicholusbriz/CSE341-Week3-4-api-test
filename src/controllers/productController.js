const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve products",
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
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve product",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, brand } = req.body;

    if (!name || !description || !category || !sku || !brand || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
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
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, sku, brand } = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    //Bulid update object
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category !== undefined) updateFields.category = category;
    if (stock !== undefined) updateFields.stock = stock;
    if (sku !== undefined) updateFields.sku = sku;
    if (brand !== undefined) updateFields.brand = brand;

    const result = await Product.updateOne(
      { _id: id },
      { $set: updateFields }
    );

    res.status(200).json({
      success: true,
      data: {
        id: id,
        ...updateFields
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
