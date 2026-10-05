import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-3xl font-extrabold text-white shadow-lg">
            S
          </div>
          <h1 className="heading text-2xl font-extrabold text-slate-900">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage the ScholarNest marketplace.</p>
        </div>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10" 
              type="email" 
              placeholder="admin@scholarnest.com" 
              required 
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10" 
              type="password" 
              placeholder="Enter your password" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-primary-600 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-700 active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
