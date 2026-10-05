import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import Dashboard from "./pages/Dashboard";
import Moderation from "./pages/Moderation";
import Users from "./pages/Users";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
      
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
              <div className="mx-auto max-w-[1600px] p-6 lg:p-10">
                <Routes>
                  <Route path="/" element={<Navigate to='/dashboard'/>} />
                  <Route path="/dashboard" element={<Dashboard token={token} />} />
                  <Route path="/moderation" element={<Moderation token={token} />} />
                  <Route path="/users" element={<Users token={token} />} />
                </Routes>
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
