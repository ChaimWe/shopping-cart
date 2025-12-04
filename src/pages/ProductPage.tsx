import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProduct";
import { Row, Col } from "antd";
import useFilteredProducts from "../hooks/useFilteredProducts";

export default function ProductPage() {
  const { products, loading } = useProducts();
  const [params] = useSearchParams();
  const searchTerm = params.get("search")?.toLowerCase() || "";
  const categoryTerm = params.get("category")?.toLowerCase() || "";

  const filteredProducts = useFilteredProducts(
    products,
    searchTerm,
    categoryTerm
  );
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Loading...</h3>
      </div>
    );
  return (
    <Row gutter={[10, 16]} justify="center" style={{ paddingTop: "50px" }}>
      {filteredProducts.map((product) => (
        <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}
