import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { AlertCircle, FileCheck, ShieldCheck, Users } from "lucide-react";

const Dashboard = ({ token }) => {
  const [queue, setQueue] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let active = true;
    Promise.all([
      axios.get(`${backendUrl}/api/listings/moderation`, { headers: { token } }),
      axios.get(`${backendUrl}/api/user/admin/verification-queue`, { headers: { token } })
    ])
      .then(([modRes, userRes]) => {
        if (active) {
          setQueue(modRes.data.listings || []);
          setUsers(userRes.data.users || []);
          setState("ready");
        }
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => { active = false };
  }, [token]);

  const pendingModeration = queue.filter(item => item.status === "pending_review").length;
  const pendingUsers = users.filter(user => user.verificationStatus === "pending").length;

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary-600">Admin Overview</p>
        <h1 className="heading mt-2 text-4xl font-extrabold text-slate-900">Good day, team.</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Keep the student marketplace helpful and safe. Review new listings and approve student accounts.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Link 
          to="/moderation" 
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Listings to review</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
              <FileCheck className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-6 text-5xl font-extrabold text-slate-900">
            {state === "loading" ? "—" : state === "error" ? "!" : pendingModeration}
          </p>
          <p className="mt-4 font-semibold text-primary-600 group-hover:text-primary-700">
            Open review queue →
          </p>
        </Link>
        
        <Link 
          to="/users" 
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Users to verify</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-6 text-5xl font-extrabold text-slate-900">
            {state === "loading" ? "—" : state === "error" ? "!" : pendingUsers}
          </p>
          <p className="mt-4 font-semibold text-emerald-600 group-hover:text-emerald-700">
            Open verification queue →
          </p>
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="heading text-lg font-bold text-slate-900">Marketplace is active and secure</h3>
            <p className="mt-2 leading-relaxed text-slate-600">
              Student submissions stay private until an admin approves them. 
              Only verified students with valid `.edu` emails or ID cards can complete their profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
