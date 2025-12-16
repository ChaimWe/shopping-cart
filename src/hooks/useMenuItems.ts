import { useNavigate } from "react-router-dom";

export default function useMenuItems(){
    const navigate= useNavigate();
    const category = [
    { key: "electronics", label: "Electronics" },
    { key: "jewelery", label: "Jewelery" },
    { key: "men's clothing", label: "Men's Clothing" },
    { key: "women's clothing", label: "Women's Clothing" },
  ];

  return( category.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: () => navigate(`store?category=${item.key}`),
  })))
}