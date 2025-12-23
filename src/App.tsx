import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./components/Chat";

function App() {
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
