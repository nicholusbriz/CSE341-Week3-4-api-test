const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "CSE341 API",
    description: "API for Users and Products",
    version: "1.0.0",
  },
  host: process.env.SWAGGER_HOST || "localhost:3000",
  schemes: [process.env.SWAGGER_SCHEME || "http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [{ name: "Users" }, { name: "Products" }],
  definitions: {
    User: {
      type: "object",
      required: [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "dateOfBirth",
        "role",
      ],
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        dateOfBirth: { type: "string" },
        role: { type: "string" },
      },
    },
    Product: {
      type: "object",
      required: [
        "name",
        "description",
        "price",
        "category",
        "stock",
        "sku",
        "brand",
      ],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        category: { type: "string" },
        stock: { type: "number" },
        sku: { type: "string" },
        brand: { type: "string" },
      },
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger generated");
});
