import { faker } from "@faker-js/faker";
import type { Product } from "../types/interfaces";
import imageByCategoryHelper from "./imageByCategoryHelper";

export default async function fakeProducts(count: number) {
  const category = Array.from({ length: count }, () =>
    faker.helpers.arrayElement([
      "electronics",
      "jewelery",
      "men's clothing",
      "women's clothing",
    ])
  );

  const images = await Promise.all(
    category.map(async (category) => {
      try {
        const image = await imageByCategoryHelper(category);
        return faker.helpers.arrayElement(image);
      } catch (e) {
        return "https://via.placeholder.com/300";
      }
    })
  );
  const products: Product[] = category.map((category, i) => ({
    id: faker.number.int(),
    title: faker.commerce.productName(),
    category,
    price: Number(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    image: images[i],
  }));
  return products;
}


