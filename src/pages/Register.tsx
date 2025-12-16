import { Card, Typography, Form, Input, Button, Alert } from "antd";
import useSubmitAuthentication from "../hooks/useSubmitAuthentication";

const { Title, Text } = Typography;

export default  function Register() {
const  [ submit,msg, loading]=  useSubmitAuthentication();


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

      <Text style={{ fontSize: "large" }}>Fill out the form to register</Text>

      <Card
        style={{
          width: "420px",
          borderRadius: "16px",
          border: "0.2px solid black",
        }}
      >
        <Form
          name="Register"
          onFinish={async(values)=>{submit(values, 'register')}}
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
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirm password" },
              ({ getFieldValue }) => ({
                validator(_: any, value: string) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error("Passwords do not match"));
                  }
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Confirm password..."
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? "Processing..." : "Register"}
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
