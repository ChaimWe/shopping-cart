import { faker } from "@faker-js/faker";
import type { Product } from "../types/interfaces";
import imageByCategoryHelper from "./imageByCategoryHelper";

export default async function fakeProducts(count: number) {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement([
      "electronics",
      "jewelery",
      "men's clothing",
      "women's clothing",
    ]);

    const images = await imageByCategoryHelper(category);
    const image = faker.helpers.arrayElement(images);

    products.push({
      id: faker.number.int(),
      title: faker.commerce.productName(),
      category,
      price: Number(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      image,
    });
  }
  return products;
}
