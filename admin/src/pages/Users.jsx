import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Users, BadgeCheck } from "lucide-react";

const UsersQueue = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/admin/verification-queue`, { headers: { token } });
      if (data.success) {
        setUsers(data.users || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const moderate = async (id, status) => {
    let reason = "";
    if (status === "rejected") {
      reason = window.prompt("Give the student a clear reason for the rejection (e.g. Invalid ID, blurry image):") || "";
      if (!reason.trim()) return;
    }
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/admin/moderate-user`, { userId: id, status, reason }, { headers: { token } });
      if (!data.success) throw new Error(data.message);
      
      toast.success(data.message);
      await fetchQueue();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const pendingUsers = users.filter(x => x.verificationStatus === "pending");

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary-600">Identity & Trust</p>
          <h1 className="heading mt-2 text-3xl font-extrabold text-slate-900">Verification Queue</h1>
          <p className="mt-2 text-slate-600">Verify student identities to maintain trust in the ScholarNest marketplace.</p>
        </div>
        <div className="flex h-10 items-center justify-center rounded-xl bg-emerald-50 px-4 font-bold text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200">
          {pendingUsers.length} pending review
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading verification queue...
        </div>
      ) : !pendingUsers.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="heading mt-6 text-xl font-bold text-slate-900">Verification queue is empty</h2>
          <p className="mt-2 max-w-sm text-slate-500">All student verification requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingUsers.map(user => (
            <article key={user._id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-extrabold text-indigo-700">
                    {(user.name || "S").charAt(0).toUpperCase()}
                  </div>
                  <div className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    Pending
                  </div>
                </div>
                
                <h2 className="heading mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm font-medium text-slate-500">{user.email}</p>
                
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Claimed Campus</p>
                  <p className="mt-1 font-bold text-slate-900">{user.campus || user.campusName || "Not provided"}</p>
                </div>
                
                {/* Note: If the backend supports ID uploads, you'd show a thumbnail here. */}
                <div className="mt-3 rounded-2xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">Please verify that this user's email domain or attached ID matches their claimed campus.</p>
                </div>
              </div>
              
              <div className="mt-auto flex gap-0.5 border-t border-slate-100 bg-slate-50 p-2">
                <button 
                  onClick={() => moderate(user._id, "verified")} 
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-3 text-sm font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-50"
                >
                  <BadgeCheck className="h-4 w-4" /> Verify
                </button>
                <button 
                  onClick={() => moderate(user._id, "rejected")} 
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-3 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersQueue;
