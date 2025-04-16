import { IProduct } from "./product.interface";
import Product from "./product.model";

const createProductIntoDB = async (product: IProduct) => {
  const result = await Product.create(product);
  return result;
};

const getAllProductFromDB = async () => {
  const result = await Product.find();
  return result;
};
const getSingleProductFromDB = async (_id: string) => {
  const result = await Product.findById({ _id });
  return result;
};

const deleteProduct = async (_id: string) => {
  const result = await Product.findByIdAndDelete({ _id });
  return result;
};

const queryProductByName = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm, "i");
  const result = Product.find({ name: regex });
  return result;
};
export const ProductServices = {
  createProductIntoDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  deleteProduct,
  queryProductByName,
};