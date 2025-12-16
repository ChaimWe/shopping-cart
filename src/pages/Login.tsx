import { Card, Typography, Form, Input, Button, Alert } from "antd";
import useSubmitAuthentication from "../hooks/useSubmitAuthentication";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {

  const navigate = useNavigate();
  const [submit, msg, loading] = useSubmitAuthentication();

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
        <Form name="Register" onFinish={async(values)=>(submit(values,'log-in'))} layout="vertical" size="large">
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
            <Input.Password type="password" placeholder="Password..." />
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
