import {
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Layout, Badge, Avatar, Input, Dropdown, Tooltip, Button } from "antd";
import { CartStore } from "../stores/CartStore";
import { observer } from "mobx-react-lite";
import { UserTracker } from "../utils/UserTracker";
import api from "../lib/api";

export default observer(function Header() {
  const Header = Layout.Header;
  const navigate = useNavigate();

  const category = [
    { key: "electronics", label: "Electronics" },
    { key: "jewelery", label: "Jewelery" },
    { key: "men's clothing", label: "Men's Clothing" },
    { key: "women's clothing", label: "Women's Clothing" },
  ];
  const menuItems = category.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: () => navigate(`store?category=${item.key}`),
  }));

  return (
    <Header
      style={{
        position:"sticky",
        top: '4px',
        display: "flex",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#8b4513",
        borderRadius: "8px",
        zIndex: 10
      }}
    >
      <div>
        <NavLink to="/">
          <img
            src="/download.png"
            alt="onlineshop"
            style={{ height: "64px", paddingRight: "10px" }}
          />
        </NavLink>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "15px",
          alignItems: "center",
          maxWidth: "700px",
        }}
      >
        <Button onClick={()=>navigate('/store')}>Store</Button>
        <Input.Search
          onSearch={(value) => navigate(`store?search=${value}`)}
          placeholder="Search store..."
        />
        <Dropdown.Button menu={{ items: menuItems }}>
          Store categories
        </Dropdown.Button>
      </div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Badge count={CartStore.addedItems.length}>
          <NavLink to={UserTracker.isLoggedIn ? "/shopping-cart" : "/login"}>
            <ShoppingCartOutlined style={{ fontSize: "26px" }} />
          </NavLink>
        </Badge>
        <NavLink to="/login">
          <Tooltip
            title={UserTracker.isLoggedIn ? UserTracker.getUsername : "No User"}
          >
            <Avatar icon={<UserOutlined />} />
          </Tooltip>
        </NavLink>
        {UserTracker.isLoggedIn?
        <Tooltip title="Logout">
        <LogoutOutlined
          onClick={async () => {
            try {
              await api.post("/logout");
              UserTracker.clearUser();
              CartStore.clrCart();
            } catch (err) {
              console.log("Unable to logout ", err);
            } finally {
              navigate("login");
            }
          }}
        /></Tooltip>:''}
      </div>
    </Header>
  );
});
