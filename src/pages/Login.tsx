import { Card, Typography, Form, Input, Button, Alert } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { CartStore } from "../stores/CartStore";
import { UserTracker } from "../utils/UserTracker";
import useProducts from "../hooks/useProduct";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const navigate = useNavigate();
  const { products } = useProducts();

  const onFinish = async (values: { username: string; password: string }) => {
    const trimmedValues = {
      username: values.username.trim(),
      password: values.password,
    }
    setLoading(true);
    setMsg(null);

    try {
      const response = await api.post("/log-in", trimmedValues);
      UserTracker.setUser(response.data.user);
      CartStore.loadFromServer(products);
      setMsg({
        type: "success",
        content: `Welcome ${values.username}! You have succesfully logged-in!`,
      });
      setTimeout(() => {
        navigate("/store");
        setMsg(null);
      }, 1200);
    } catch (err: any) {
      const error = err.response?.data?.message || "Server error";
      setMsg({ type: "error", content: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title level={3}> Welcome to EasyShop</Title>

      <Text style={{ fontSize: "large" }}>Enter your login credentials</Text>

      <Card
        style={{
          width: "420px",
          borderRadius: "16px",
          border: "0.2px solid black",
        }}
      >
        <Form
          name="Register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "Username must be at lease 3 characters" },
            ]}
          >
            <Input
              onBlur={(e) => (e.target.value = e.target.value.trim())}
              placeholder="Username..."
            />
          </Form.Item>{" "}
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 4, message: "Password must be at least 4 characters" },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password..."
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading} block>
              {loading ? "Processing..." : "Login"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              htmlType="submit"
              onClick={() => navigate("/register")}
              block
            >
              Yet to register?{" "}
            </Button>
          </Form.Item>
        </Form>

        {msg && (
          <Alert
            message={msg.content}
            type={msg.type}
            showIcon
            style={{ textAlign: "center" }}
          />
        )}
      </Card>
    </div>
  );
}
