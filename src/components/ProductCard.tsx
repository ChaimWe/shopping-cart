import React, { useState } from "react";
import type { ProductCardProps } from "../types/interfaces";
import { Card, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { UserTracker } from "../utils/UserTracker";
import { useNavigate } from "react-router-dom";
import { CartStore } from "../lib/CartStore";

function ProductCard({ product }: ProductCardProps) {
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFulldescription, setShowFulldescription] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const TITLE_MAX_LENGTH = 23;
  const description_MAX_LENGTH = 150;

  const displayTitle =
    product.title.length > TITLE_MAX_LENGTH && !showFullTitle
      ? product.title.slice(0, TITLE_MAX_LENGTH) + "..."
      : product.title;

  const displaydescription =
    product.description.length > description_MAX_LENGTH && !showFulldescription
      ? product.description.slice(0, description_MAX_LENGTH) + "..."
      : product.description;

  return (
    <Card
      hoverable
      style={{
        width: 250,
        textAlign: "center",
        margin: "auto",
        backgroundColor: "#e8fae6",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
      cover={
        <img
          alt={product.title}
          src={product.image}
          loading="lazy"
          style={{ height: 200, objectFit: "contain" }}
        />
      }
      title={
        <span
          style={{
            color: "black",
            cursor:
              product.title.length > TITLE_MAX_LENGTH ? "pointer" : "default",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
          onClick={() => {
            if (product.title.length > TITLE_MAX_LENGTH)
              setShowFullTitle(!showFullTitle);
          }}
          title={product.title}
        >
          {displayTitle}
        </span>
      }
    >
      <p
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          cursor:
            product.description.length > description_MAX_LENGTH
              ? "pointer"
              : "default",
        }}
        onClick={() => {
          if (product.description.length > description_MAX_LENGTH)
            setShowFulldescription(!showFulldescription);
        }}
        title={product.description}
      >
        {displaydescription}
      </p>

      {product.description.length > description_MAX_LENGTH && (
        <Button
          type="link"
          onClick={() => setShowFulldescription(!showFulldescription)}
        >
          {showFulldescription ? "Show less" : "Read more"}
        </Button>
      )}

      <p>
        <b>Price: ${product.price}</b>
      </p>

      {product.amount === undefined ? (
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => {
            if (UserTracker.isLoggedIn) {
              CartStore.addToCart(product.id);
              setAdded(true);
              setTimeout(() => {
                setAdded(false);
              }, 2000);
            } else {
              navigate("/login");
            }
          }}
          disabled={added}
          block
        >
          {!added ? "Add to Cart" : "Added"}
        </Button>
      ) : (
        <p>Amount: {product.amount}</p>
      )}
    </Card>
  );
}
export default React.memo(ProductCard);