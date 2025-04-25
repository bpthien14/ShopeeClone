import z from "zod";

// Product Schema
const ProductValidationSchema = z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    price: z
      .number()
      .min(0.01, { message: "Price must be greater than 0" }),
    photoUrls: z
      .array(z.string().url({ message: "Must be valid URLs" }))
      .optional(),
    quantity: z
      .number()
      .int()
      .min(0, { message: "Quantity cannot be negative" }),
    status: z
      .enum(['active', 'draft'])
      .optional()
      .default('active'),
});
  
export default ProductValidationSchema;