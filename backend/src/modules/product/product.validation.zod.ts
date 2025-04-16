import z from "zod";

// Product Schema
const ProductValidationSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "description is required" }),
    price: z
      .number()
      .min(0.01, { message: "price is required and must be a positive number" }),
    category: z.string().nonempty({ message: "category is required" }),
    tags: z
      .array(z.string().nonempty({ message: "tags must be non-empty strings" }))
      .nonempty({ message: "tags is required" }),
    quantity: z
        .number()
        .int()
        .min(1, { message: "quantity is required and must be a positive integer" }),
    inStock: z.boolean({ message: "inStock is required" }),
  });
  
  export default ProductValidationSchema;