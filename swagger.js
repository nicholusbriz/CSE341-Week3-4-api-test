const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'W03 Project API',
    description: 'Node.js API with MongoDB and Swagger for CSE 341 W03 Project. This API provides CRUD operations for Users and Products collections with comprehensive validation and error handling.',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Products',
      description: 'Product management operations'
    }
  ],
  definitions: {
    User: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'phone', 'address', 'dateOfBirth'],
      properties: {
        _id: {
          type: 'string',
          description: 'Unique identifier for the user'
        },
        firstName: {
          type: 'string',
          description: 'First name of the user',
          minLength: 2,
          maxLength: 50
        },
        lastName: {
          type: 'string',
          description: 'Last name of the user',
          minLength: 2,
          maxLength: 50
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email address of the user'
        },
        phone: {
          type: 'string',
          description: 'Phone number of the user'
        },
        address: {
          type: 'object',
          required: ['street', 'city', 'state', 'zipCode'],
          properties: {
            street: {
              type: 'string',
              description: 'Street address'
            },
            city: {
              type: 'string',
              description: 'City'
            },
            state: {
              type: 'string',
              description: 'State'
            },
            zipCode: {
              type: 'string',
              description: 'Zip code'
            }
          }
        },
        dateOfBirth: {
          type: 'string',
          format: 'date',
          description: 'Date of birth (YYYY-MM-DD)'
        },
        role: {
          type: 'string',
          enum: ['user', 'admin', 'moderator'],
          default: 'user'
        },
        isActive: {
          type: 'boolean',
          default: true
        },
        createdAt: {
          type: 'string',
          format: 'date-time'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time'
        }
      }
    },
    Product: {
      type: 'object',
      required: ['name', 'description', 'price', 'category', 'stock', 'sku', 'brand'],
      properties: {
        _id: {
          type: 'string',
          description: 'Unique identifier for the product'
        },
        name: {
          type: 'string',
          description: 'Product name',
          minLength: 3,
          maxLength: 100
        },
        description: {
          type: 'string',
          description: 'Product description',
          minLength: 10,
          maxLength: 1000
        },
        price: {
          type: 'number',
          description: 'Product price',
          minimum: 0
        },
        category: {
          type: 'string',
          enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Other'],
          description: 'Product category'
        },
        stock: {
          type: 'number',
          description: 'Stock quantity',
          minimum: 0
        },
        sku: {
          type: 'string',
          description: 'Stock Keeping Unit (unique identifier)'
        },
        brand: {
          type: 'string',
          description: 'Product brand',
          maxLength: 50
        },
        weight: {
          type: 'number',
          description: 'Product weight',
          minimum: 0
        },
        dimensions: {
          type: 'object',
          properties: {
            length: {
              type: 'number',
              minimum: 0
            },
            width: {
              type: 'number',
              minimum: 0
            },
            height: {
              type: 'number',
              minimum: 0
            }
          }
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            maxLength: 30
          }
        },
        isActive: {
          type: 'boolean',
          default: true
        },
        rating: {
          type: 'number',
          minimum: 0,
          maximum: 5,
          default: 0
        },
        reviews: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              user: {
                type: 'string'
              },
              rating: {
                type: 'number',
                minimum: 1,
                maximum: 5
              },
              comment: {
                type: 'string'
              },
              date: {
                type: 'string',
                format: 'date-time'
              }
            }
          }
        },
        createdAt: {
          type: 'string',
          format: 'date-time'
        },
        updatedAt: {
          type: 'string',
          format: 'date-time'
        }
      }
    },
    SuccessResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        data: {
          type: 'object'
        }
      }
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        error: {
          type: 'string'
        }
      }
    },
    ListResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        count: {
          type: 'number'
        },
        data: {
          type: 'array'
        }
      }
    }
  },
  securityDefinitions: {
    // OAuth will be added in W04
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
  console.log('Swagger UI available at: http://localhost:3000/api-docs');
});
