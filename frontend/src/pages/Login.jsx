import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  
  const [mode, setMode] = useState("login");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (token) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [token, navigate, location]);

  const submit = async (event) => {
    event.preventDefault();
    if (mode === "register" && password !== confirm) {
      return toast.error("Passwords do not match.");
    }
    
    setBusy(true);
    try {
      const path = mode === "register" ? "/api/user/register" : "/api/user/login";
      const body = mode === "register" 
        ? { name, email, phone, password, confirmPassword: confirm } 
        : { emailOrPhone: identity, password };
        
      const { data } = await axios.post(`${backendUrl}${path}`, body);
      
      if (!data.success) throw new Error(data.message);
      
      setToken(data.token);
      toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[85vh] max-w-5xl items-center gap-10 py-10 pb-28 md:grid-cols-[1fr_.9fr] md:py-16">
      
      {/* Decorative Branding Side */}
      <div className="relative hidden overflow-hidden rounded-3xl bg-slate-950 p-10 text-white md:block lg:p-14">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-slate-950 to-slate-950" />
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-2xl font-extrabold text-white shadow-lg">
            S
          </div>
          <div className="mt-auto">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary-300">
              <Sparkles className="h-4 w-4" /> Your campus marketplace
            </p>
            <h1 className="heading mt-4 text-4xl font-extrabold leading-tight text-white lg:text-5xl">
              Good things <br />
              <span className="text-primary-400">find new homes.</span>
            </h1>
            <p className="mt-5 max-w-sm leading-relaxed text-slate-300">
              Join students sharing useful finds, fair prices, and a little more room in the budget.
            </p>
            <div className="mt-10 border-t border-white/10 pt-6 text-sm font-semibold text-slate-400">
              Student-powered · Local · Circular
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Side */}
      <form onSubmit={submit} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <button 
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-1.5 self-start text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to ScholarNest
        </button>

        <h2 className="heading text-3xl font-extrabold text-slate-900">
          {mode === "login" ? "Welcome back" : "Join your campus"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "login" 
            ? "Sign in to save finds and sell what you no longer need." 
            : "Create an account to connect with your student community."}
        </p>

        <div className="mt-8 space-y-4">
          {mode === "register" && (
            <>
              <Input 
                required 
                label="Your name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Alex Student" 
              />
              <Input 
                required 
                label="Phone" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+91..." 
              />
            </>
          )}

          {mode === "login" ? (
            <Input 
              required 
              label="Email or phone" 
              value={identity} 
              onChange={e => setIdentity(e.target.value)} 
              placeholder="you@college.edu" 
            />
          ) : (
            <Input 
              required 
              type="email" 
              label="Student Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@college.edu" 
            />
          )}

          <Input 
            required 
            type="password" 
            minLength={8} 
            label="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="At least 8 characters" 
          />

          {mode === "register" && (
            <Input 
              required 
              type="password" 
              label="Confirm password" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              placeholder="Type it again" 
            />
          )}
        </div>

        <Button 
          type="submit" 
          disabled={busy} 
          isLoading={busy} 
          size="lg" 
          className="mt-8 w-full"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>

        {mode === "login" && (
          <Link to="/reset-password" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
            Forgot password?
          </Link>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
          {mode === "login" ? "New to ScholarNest?" : "Already have an account?"}
          <button 
            type="button" 
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }} 
            className="ml-1.5 font-bold text-primary-600 hover:text-primary-700 hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Login;
