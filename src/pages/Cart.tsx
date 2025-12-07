import { observer } from "mobx-react-lite";
import useProducts from "../hooks/useProduct";
import { CartStore } from "../lib/CartStore";
import type { CartProduct } from "../types/interfaces";
import { Table, Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default observer(function Cart() {
  const inCart = CartStore.addedItems;
  const { products } = useProducts();
  const navigate = useNavigate();

  const cartProducts: CartProduct[] = inCart.map((item) => {
    
      const product = products.find((p) => p.id === item.id);
      if (!product) return null;
      return { ...product, amount: item.amount };

    }).filter((item): item is CartProduct => item !== null);

  const total = cartProducts.reduce(
    (sum, product) => sum + product.amount * product.price,
    0
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Shopping Cart</Title>
      <Table
        dataSource={cartProducts}
        rowKey="id"
        pagination={false}
        columns={[
          { title: "Product", dataIndex: "title", key: "title" },
          {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (img) => <img src={img} style={{ height: 50 }} />,
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price.toFixed(2)}`,
          },
          {
            title: "Subtotal",
            key: "subtotal",
            render: (_, record) =>
              `$${(record.price * record.amount).toFixed(2)}`,
          },
          {
            title: "Quantity",
            key: "quantity",
            render: (_, record) => (
              <Space>
                <Button onClick={() => CartStore.decrementAmount(record.id)}>
                  -
                </Button>
                {record.amount}
                <Button onClick={() => CartStore.incrementAmount(record.id)}>
                  +
                </Button>
              </Space>
            ),
          },
          {
            title: "Remove",
            key: "remove",
            render: (_, record) => (
              <Button
                onClick={() => CartStore.removeFromCart(record.id)}
                danger
              >
                Remove
              </Button>
            ),
          },
        ]}
      />
      <div style={{ textAlign: "right" }}>
        <Title level={3} style={{ marginTop: 20 }}>
          Total: ${total.toFixed(2)}
        </Title>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/payment")}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
});
