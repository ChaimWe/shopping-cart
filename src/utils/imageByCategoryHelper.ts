export default async function imageByCategoryHelper(category: string): Promise<string[]> {
  const response = await fetch(
    `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
  );
  const apiProducts = await response.json();
  return apiProducts.map((product: { image: string }) => product.image);
}
