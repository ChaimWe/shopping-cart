import { makeAutoObservable } from "mobx";

export const UserTracker = makeAutoObservable({
  user: null as { id: number; username: string } | null,
  setUser(user: { id: number; username: string }) {
    this.user = user;
  },
  clearUser() {
    this.user = null;
  },
  get isLoggedIn() {
    return !!this.user;
  },
  get getUsername() {
    return this.user?.username;
  },
});
