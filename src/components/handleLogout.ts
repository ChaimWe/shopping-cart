import api from "../lib/api";
import { CartStore } from "../lib/CartStore";
import { UserTracker } from "../utils/UserTracker";

export default async function handleLogout(navigate: (path: string) => void) {
  try {
    await api.post("/logout");
    UserTracker.clearUser();
    CartStore.clrCart();
  } catch (err) {
    console.log("Unable to logout ", err);
  } finally {
    navigate("login");
  }
}
