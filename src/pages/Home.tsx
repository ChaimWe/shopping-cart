import { Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", textAlign: "center" }}>
      <Title>Welcome to ShopEase!</Title>
      <Paragraph>
        Welcome to ShopEase, your online destination for a seamless shopping
        experience. Browse a wide variety of products across different
        categories, from groceries to electronics, and easily add your favorites
        to the cart. Keep track of your selected items, adjust quantities, and
        see your total in real time. Designed for simplicity and convenience,
        ShopEase makes shopping online fast, intuitive, and enjoyable. (source:
        ChatGpt)
      </Paragraph>

      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <Button type="primary" onClick={() => navigate("/store")}>
          Browse Store
        </Button>
        <Button type="primary" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </div>
  );
}
