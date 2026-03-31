const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while fetching product'
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'stock', 'sku', 'brand'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate price is positive
    if (productData.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }

    // Validate stock is non-negative integer
    if (!Number.isInteger(productData.stock) || productData.stock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock must be a non-negative integer'
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        error: 'Product with this SKU already exists'
      });
    }

    // Validate category
    const validCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Other'];
    if (!validCategories.includes(productData.category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Validate dimensions if provided
    if (productData.dimensions) {
      const { length, width, height } = productData.dimensions;
      if (length && length < 0) {
        return res.status(400).json({
          success: false,
          error: 'Length cannot be negative'
        });
      }
      if (width && width < 0) {
        return res.status(400).json({
          success: false,
          error: 'Width cannot be negative'
        });
      }
      if (height && height < 0) {
        return res.status(400).json({
          success: false,
          error: 'Height cannot be negative'
        });
      }
    }

    // Validate weight if provided
    if (productData.weight && productData.weight <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be greater than 0'
      });
    }

    // Validate tags if provided
    if (productData.tags && Array.isArray(productData.tags)) {
      for (const tag of productData.tags) {
        if (tag.length > 30) {
          return res.status(400).json({
            success: false,
            error: 'Tag cannot exceed 30 characters'
          });
        }
      }
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered (SKU must be unique)'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while creating product'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Don't allow updating SKU to existing one
    if (productData.sku) {
      const existingProduct = await Product.findOne({
        sku: productData.sku,
        _id: { $ne: req.params.id }
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          error: 'SKU already exists'
        });
      }
    }

    // Validate category if provided
    if (productData.category) {
      const validCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Other'];
      if (!validCategories.includes(productData.category)) {
        return res.status(400).json({
          success: false,
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    // Validate price if provided
    if (productData.price !== undefined && productData.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be greater than 0'
      });
    }

    // Validate stock if provided
    if (productData.stock !== undefined && (!Number.isInteger(productData.stock) || productData.stock < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Stock must be a non-negative integer'
      });
    }

    // Validate dimensions if provided
    if (productData.dimensions) {
      const { length, width, height } = productData.dimensions;
      if (length !== undefined && length < 0) {
        return res.status(400).json({
          success: false,
          error: 'Length cannot be negative'
        });
      }
      if (width !== undefined && width < 0) {
        return res.status(400).json({
          success: false,
          error: 'Width cannot be negative'
        });
      }
      if (height !== undefined && height < 0) {
        return res.status(400).json({
          success: false,
          error: 'Height cannot be negative'
        });
      }
    }

    // Validate weight if provided
    if (productData.weight !== undefined && productData.weight <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be greater than 0'
      });
    }

    // Validate tags if provided
    if (productData.tags && Array.isArray(productData.tags)) {
      for (const tag of productData.tags) {
        if (tag.length > 30) {
          return res.status(400).json({
            success: false,
            error: 'Tag cannot exceed 30 characters'
          });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${errors.join(', ')}`
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate field value entered (SKU must be unique)'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while updating product'
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { message: 'Product deleted successfully' }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while deleting product'
    });
  }
};
