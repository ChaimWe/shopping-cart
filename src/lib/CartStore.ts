import { makeAutoObservable, reaction, runInAction } from "mobx";
import type { AddedItems, Product } from "../types/interfaces";
import api from "./api";
import { UserTracker } from "../utils/UserTracker";

export const CartStore = makeAutoObservable({
  addedItems: [] as AddedItems[],
  cleanInvalidItems(validProducts: { id: number }[]) {
    this.addedItems = this.addedItems.filter((item) =>
      validProducts.some((product) => product.id === item.id)
    );
  },

  addToCart(id: number) {
    const existing = this.addedItems.find((item) => item.id === id);
    if (existing) {
      existing.amount += 1;
    } else {
      this.addedItems.push({ id, amount: 1 });
    }
    console.log("addedItem");
  },

  removeFromCart(id: number) {
    this.addedItems = this.addedItems.filter((item) => item.id !== id);
  },
  decrementAmount(id: number) {
    const toDecrement = this.addedItems.find((item) => item.id === id);
    if (!toDecrement) return;
    if (toDecrement.amount > 1) {
      toDecrement.amount -= 1;
    } else {
      this.removeFromCart(id);
    }
  },
  incrementAmount(id: number) {
    const toIncrement = this.addedItems.find((item) => item.id === id);
    if (!toIncrement) return;
    toIncrement.amount += 1;
  },
  clrCart() {
    this.addedItems = [];
  },

  async loadFromServer(products?: Product[]) {
    try {
      const response = await api.get("/api/cart");
      runInAction(() => {
        this.addedItems = response.data.items || [];
        if (products && products.length > 0) {
          this.cleanInvalidItems(products);
        }
      });
    } catch (error) {
      console.log("Unable to fetch cart ", error);
    }
  },
});

reaction(
  () =>
    CartStore.addedItems.map((item) => ({
      id: item.id,
      amount: item.amount,
    })),
  async (cart) => {
    if (UserTracker.isLoggedIn) {
      try {
        await api.post("/api/cart/sync", { items: cart });
      } catch (err) {
        console.log("Unable to sync cart ", err);
      }
    }
  }
);
