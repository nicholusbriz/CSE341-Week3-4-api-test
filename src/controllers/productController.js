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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const updateFields = {};
    const requiredFields = ['name', 'description', 'category', 'sku', 'brand'];
    const numericFields = ['price', 'stock'];

    for (const field of requiredFields) {
      if (req.body[field] !== undefined) {
        if (!req.body[field] || req.body[field].trim() === '') {
          return res.status(400).json({
            success: false,
            error: `Product ${field} cannot be empty`
          });
        }
        updateFields[field] = req.body[field];
      }
    }

    if (req.body.price !== undefined) {
      if (isNaN(req.body.price) || req.body.price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Price must be a positive number'
        });
      }
      updateFields.price = parseFloat(req.body.price);
    }

    if (req.body.stock !== undefined) {
      if (isNaN(req.body.stock) || req.body.stock < 0) {
        return res.status(400).json({
          success: false,
          error: 'Stock must be a positive number'
        });
      }
      updateFields.stock = parseInt(req.body.stock);
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }

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
