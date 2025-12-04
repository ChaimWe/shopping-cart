import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import api from "./lib/api";
import { UserTracker } from "./utils/UserTracker";
import { CartStore } from "./stores/CartStore";
import { useEffect } from "react";
import useProducts from "./hooks/useProduct";
import Chat from "./components/Chat";

function App() {
  const { products } = useProducts();
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.post("/me");
        UserTracker.setUser(response.data.user);
        CartStore.loadFromServer(products);
      } catch (err) {
        UserTracker.clearUser();
      }
    };
    checkLogin();
  }, []);
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<ProductPage />} />
        <Route path="/shopping-cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Chat />
    </div>
  );
}

export default App;
