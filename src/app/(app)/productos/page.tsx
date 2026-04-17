import { db } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const products = await db.getProducts();
  return <ProductsClient initial={products} />;
}
