import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "./useProduct";
import api from "../lib/api";
import { UserTracker } from "../utils/UserTracker";
import { CartStore } from "../lib/CartStore";

export default function useSubmitAuthentication() {
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  const navigate = useNavigate();
  const { products } = useProducts();

  const submit = async (
    values: { username: string; password: string },
    authType: string
  ) => {
    const trimmedValues = {
      username: values.username.trim(),
      password: values.password,
    };
    setLoading(true);
    setMsg(null);

    try {
      const response = await api.post(`/${authType}`, trimmedValues);
      UserTracker.setUser(response.data.user);
      CartStore.loadFromServer(products);

      setMsg({
        type: "success",
        content: `Welcome ${values.username}! You have succesfully connected!`,
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
  return [submit, msg, loading] as const;
}
