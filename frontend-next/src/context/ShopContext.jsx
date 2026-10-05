"use client";

import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // Prevent hydration mismatch by lazy loading token
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  // Ensure axios requests include the token automatically
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      localStorage.setItem("token", token);
    } else if (token === "") {
      delete axios.defaults.headers.common["token"];
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`);
      if (data.success) {
        setUser(data.data);
      } else {
        setToken("");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setToken("");
      }
    }
  }, [token, backendUrl]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const logout = () => {
    setToken("");
    router.push("/");
  };

  const value = {
    currency,
    token,
    setToken,
    user,
    setUser,
    backendUrl,
    navigate: router.push,
    logout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;
