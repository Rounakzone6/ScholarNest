import { useContext, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { PlusCircle, ImagePlus, X, AlertCircle, Check } from "lucide-react";

const categories = [
  "Books & Study Material", 
  "Electronics", 
  "Hostel Essentials", 
  "Furniture", 
  "Cycles & Vehicles", 
  "Fashion", 
  "Sports", 
  "Gaming", 
  "Musical Instruments", 
  "Stationery", 
  "Other"
];

const conditions = ["Like New", "Good", "Fair"];

const Sell = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  
  const [step, setStep] = useState(1); 
  const [busy, setBusy] = useState(false); 
  const [files, setFiles] = useState([]);
  
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    category: categories[0], 
    condition: "Good", 
    price: "", 
    originalPrice: "", 
    negotiable: false, 
    campus: "", 
    area: "", 
    pickupPreference: "Campus meetup", 
  });

  const previews = useMemo(() => files.map(file => ({ file, url: URL.createObjectURL(file) })), [files]);
  
  const field = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  if (!token) {
    return (
      <main className="mx-auto max-w-2xl py-20 pb-28 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600">
          <PlusCircle className="h-10 w-10" />
        </div>
        <h1 className="heading text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Your campus could use this.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Sign in to create a listing. You’ll be able to save it as a draft or send it for review.
        </p>
        <Button onClick={() => navigate("/login")} size="lg" className="mt-8">
          Sign in to continue
        </Button>
      </main>
    );
  }

  const submit = async (draft = false) => {
    setBusy(true);
    try { 
      const data = new FormData(); 
      Object.entries(form).forEach(([key, value]) => data.append(key, String(value))); 
      // Rename 'category' to 'categoryName' to match backend
      data.delete("category");
      data.append("categoryName", form.category);

      data.append("draft", String(draft)); 
      files.forEach(file => data.append("images", file)); 

      const response = await axios.post(`${backendUrl}/api/listings`, data, { headers: { token } }); 
      if (!response.data.success) throw new Error(response.data.message); 
      
      toast.success(response.data.message); 
      navigate("/browse"); 
    } catch (error) { 
      toast.error(error.response?.data?.message || error.message || "Could not submit your listing."); 
    } finally { 
      setBusy(false); 
    }
  };

  const nextStep = () => { 
    if (step === 1 && (!form.title.trim() || !form.description.trim() || !form.price || Number(form.price) < 1)) {
      return toast.error("Add a title, description, and valid price first."); 
    }
    if (step === 2 && !files.length) {
      return toast.error("Add at least one photo to continue."); 
    }
    if (step === 3 && !form.campus.trim()) {
      return toast.error("Add your university or campus."); 
    }
    setStep(Math.min(4, step + 1)); 
  };

  const steps = ["Item details", "Photos", "Campus", "Preview"];

  return (
    <main className="mx-auto max-w-3xl py-8 pb-28">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-600">
          Sell on ScholarNest
        </p>
        <h1 className="heading mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Pass it on. Make a little back.
        </h1>
        <p className="mt-3 text-slate-600">
          Reach students around your campus. Your listing goes live after a quick review.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10 flex items-center justify-between gap-2">
        {steps.map((label, i) => {
          const isCompleted = step > i + 1;
          const isCurrent = step === i + 1;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div 
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : 
                  isCurrent ? "bg-primary-600 text-white shadow-md shadow-primary-600/20" : 
                  "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </div>
              <span className={`hidden text-xs font-bold sm:block ${isCurrent ? "text-slate-900" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
                {label}
              </span>
              {i < 3 && <div className={`h-1 flex-1 rounded-full transition-colors ${isCompleted ? "bg-emerald-100" : "bg-slate-100"}`} />}
            </div>
          );
        })}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        
        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="heading text-xl font-extrabold text-slate-900">Tell us about the item</h2>
            
            <Input 
              label="Listing title" 
              maxLength="100" 
              value={form.title} 
              onChange={e => field("title", e.target.value)} 
              placeholder="e.g. Casio scientific calculator, barely used" 
            />
            
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Description</label>
              <textarea 
                maxLength="3000" 
                rows="4" 
                value={form.description} 
                onChange={e => field("description", e.target.value)} 
                placeholder="Share the details another student would want to know…" 
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10"
              />
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <Select 
                label="Category"
                value={form.category} 
                onChange={e => field("category", e.target.value)} 
                options={categories.map(c => ({ label: c, value: c }))}
              />
              <Select 
                label="Condition"
                value={form.condition} 
                onChange={e => field("condition", e.target.value)} 
                options={conditions.map(c => ({ label: c, value: c }))}
              />
              <Input 
                type="number" 
                min="1" 
                label="Selling price (₹)"
                value={form.price} 
                onChange={e => field("price", e.target.value)} 
                placeholder="850" 
              />
              <Input 
                type="number" 
                min="0" 
                label="Original price (optional)"
                value={form.originalPrice} 
                onChange={e => field("originalPrice", e.target.value)} 
                placeholder="1500" 
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50">
              <input 
                type="checkbox" 
                checked={form.negotiable} 
                onChange={e => field("negotiable", e.target.checked)} 
                className="h-5 w-5 accent-primary-600"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">Open to reasonable offers</p>
                <p className="text-xs text-slate-500">Students can negotiate the price with you.</p>
              </div>
            </label>
          </div>
        )}

        {/* STEP 2: Photos */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="heading text-xl font-extrabold text-slate-900">Show it clearly</h2>
            <p className="text-sm text-slate-600">Add up to six photos. The first photo appears on your listing card.</p>
            
            <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/50">
              <ImagePlus className="h-10 w-10 text-primary-500" />
              <span className="mt-3 text-sm font-bold text-slate-900">Click to upload photos</span>
              <span className="mt-1 text-xs text-slate-500">JPG, PNG or WebP · up to 6 images</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="sr-only" 
                onChange={e => {
                  const next = [...files, ...Array.from(e.target.files || [])].slice(0, 6);
                  setFiles(next);
                  e.target.value = "";
                }}
              />
            </label>
            
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {previews.map((item, i) => (
                  <div key={item.url} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                    <img src={item.url} className="h-full w-full object-cover" alt={`Upload ${i+1}`}/>
                    <button 
                      type="button" 
                      onClick={() => setFiles(files.filter((_, index) => i !== index))} 
                      className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-slate-900/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-red-600 group-hover:opacity-100" 
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-900/75 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Location */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="heading text-xl font-extrabold text-slate-900">Where can students find you?</h2>
            <p className="text-sm text-slate-600">Only your campus and general area are shown publicly. Never enter your home address.</p>
            
            <div className="space-y-6">
              <Input 
                label="University or campus"
                value={form.campus} 
                onChange={e => field("campus", e.target.value)} 
                placeholder="e.g. BBD University, Lucknow" 
              />
              <Input 
                label="Area or campus zone (optional)"
                value={form.area} 
                onChange={e => field("area", e.target.value)} 
                placeholder="e.g. Main Campus Library" 
              />
              <Select 
                label="Preferred handoff"
                value={form.pickupPreference} 
                onChange={e => field("pickupPreference", e.target.value)} 
                options={[
                  { label: "Campus meetup", value: "Campus meetup" },
                  { label: "Pickup from a public campus spot", value: "Pickup from a public campus spot" },
                  { label: "Can arrange delivery", value: "Can arrange delivery" }
                ]}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Preview */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="heading text-xl font-extrabold text-slate-900">Preview your listing</h2>
            <p className="text-sm text-slate-600">Check the details before submitting for review.</p>
            
            <div className="overflow-hidden rounded-3xl border border-slate-200 sm:flex">
              {previews[0] && (
                <div className="aspect-[4/3] w-full bg-slate-100 sm:w-2/5 sm:shrink-0">
                  <img src={previews[0].url} alt="Listing preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="default">{form.condition}</Badge>
                  {form.negotiable && <Badge variant="primary">Negotiable</Badge>}
                </div>
                <h3 className="heading text-2xl font-extrabold text-slate-900">{form.title}</h3>
                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  ₹{Number(form.price || 0).toLocaleString("en-IN")}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {form.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
                  <span>{form.category}</span>
                  <span>•</span>
                  <span>{form.campus}</span>
                  <span>•</span>
                  <span>{form.pickupPreference}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-5 text-amber-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm font-medium leading-relaxed">
                ScholarNest reviews your listing before it appears publicly. It usually takes a few hours. We’ll email you when it goes live.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <Button 
            variant="ghost" 
            onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          <div className="flex flex-wrap gap-3">
            {step === 4 && (
              <Button 
                variant="secondary" 
                disabled={busy} 
                onClick={() => submit(true)}
              >
                Save draft
              </Button>
            )}
            
            {step < 4 ? (
              <Button onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button 
                disabled={busy} 
                isLoading={busy}
                onClick={() => submit(false)}
              >
                {busy ? "Submitting…" : "Submit for review"}
              </Button>
            )}
          </div>
        </div>
        
      </section>
    </main>
  );
};

export default Sell;
