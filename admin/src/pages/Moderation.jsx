import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Search, ExternalLink } from "lucide-react";

const Moderation = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  const fetchQueue = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/listings/moderation`, { headers: { token } });
      if (data.success) {
        setListings(data.listings || []);
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
    let rejectionReason = "";
    if (status === "rejected") {
      rejectionReason = window.prompt("Give the student a clear reason for the rejection (e.g. Inappropriate item, missing details):") || "";
      if (!rejectionReason.trim()) return;
    }
    
    try {
      const { data } = await axios.post(`${backendUrl}/api/listings/moderate`, { id, status, rejectionReason }, { headers: { token } });
      if (!data.success) throw new Error(data.message);
      
      toast.success(data.message);
      setActive(null);
      await fetchQueue();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const pendingListings = listings.filter(x => x.status === "pending_review");

  return (
    <div className="mx-auto max-w-6xl animate-fade-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary-600">Marketplace operations</p>
          <h1 className="heading mt-2 text-3xl font-extrabold text-slate-900">Listing Moderation</h1>
          <p className="mt-2 text-slate-600">Review student submissions before they appear in the public browse area.</p>
        </div>
        <div className="flex h-10 items-center justify-center rounded-xl bg-amber-50 px-4 font-bold text-amber-700 shadow-sm ring-1 ring-inset ring-amber-200">
          {pendingListings.length} pending review
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Loading review queue...
        </div>
      ) : !pendingListings.length ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="heading mt-6 text-xl font-bold text-slate-900">All caught up!</h2>
          <p className="mt-2 max-w-sm text-slate-500">The marketplace is clean. New student listings will appear here when submitted.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingListings.map(item => (
            <article key={item._id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:flex-row">
              <div className="aspect-video w-full bg-slate-100 sm:aspect-square sm:w-48 sm:shrink-0">
                <img src={item.images?.[0] || "/vite.svg"} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="heading text-lg font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">₹{Number(item.price).toLocaleString("en-IN")}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-600">
                      <span>Condition: <strong className="text-slate-900">{item.condition}</strong></span>
                      <span>Category: <strong className="text-slate-900">{item.category}</strong></span>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Search className="h-3 w-3" /> {item.sellerId?.name || "Student"}</span>
                      <span>•</span>
                      <span>{item.campus}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3 sm:mt-auto">
                  <button 
                    onClick={() => setActive(item)} 
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    <ExternalLink className="h-4 w-4" /> View Details
                  </button>
                  <button 
                    onClick={() => moderate(item._id, "published")} 
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button 
                    onClick={() => moderate(item._id, "rejected")} 
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal View Details */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={() => setActive(null)}>
          <section 
            onClick={e => e.stopPropagation()} 
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="heading text-xl font-bold text-slate-900">Review Listing</h2>
              <button 
                onClick={() => setActive(null)} 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(active.images || []).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={image} alt={`Listing image ${index+1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="heading text-2xl font-bold text-slate-900">{active.title}</h3>
                <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
                  {active.description}
                </p>
                
                <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                  <dl className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <dt className="text-slate-500">Price</dt>
                      <dd className="mt-1 font-bold text-slate-900">₹{Number(active.price).toLocaleString("en-IN")}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Seller Name</dt>
                      <dd className="mt-1 font-bold text-slate-900">{active.sellerId?.name}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Campus</dt>
                      <dd className="mt-1 font-bold text-slate-900">{active.campus}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Pickup Preference</dt>
                      <dd className="mt-1 font-bold text-slate-900">{active.pickupPreference}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5">
              <button 
                onClick={() => moderate(active._id, "published")} 
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Approve Listing
              </button>
              <button 
                onClick={() => moderate(active._id, "rejected")} 
                className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700"
              >
                Reject with Reason
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Moderation;
