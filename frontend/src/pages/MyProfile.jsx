import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, PlusCircle, Package } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

import ListingCard from "../components/ListingCard";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";

const MyProfile = () => {
  const { username } = useParams();
  const { backendUrl, token, navigate } = useContext(ShopContext);
  
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);

    const load = async () => {
      try {
        if (username) {
          // Public Profile
          const { data } = await axios.get(`${backendUrl}/api/user/profile/${encodeURIComponent(username)}`);
          if (!data.success) throw new Error(data.message);
          if (active) {
            setUser(data.user);
            setListings(data.listings || []);
          }
        } else {
          // Private Profile
          if (!token) {
            navigate("/login");
            return;
          }
          const [profile, mine] = await Promise.all([
            axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } }),
            axios.get(`${backendUrl}/api/listings/user/mine`, { headers: { token } })
          ]);
          if (active) {
            setUser(profile.data.data || profile.data.userData);
            setListings(mine.data.listings || []);
          }
        }
      } catch (e) {
        if (active) setError(e.response?.data?.message || e.message || "Could not load this profile.");
      } finally {
        if (active) setLoading(false);
      }
    };
    
    load();
    return () => { active = false; };
  }, [username, backendUrl, token, navigate]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl animate-pulse py-8 pb-28 sm:py-12">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl py-24 pb-32 text-center">
        <ErrorState title="Profile unavailable" description={error} />
      </main>
    );
  }

  const isOwner = !username;

  const getStatusVariant = (status) => {
    switch(status) {
      case "published": return "success";
      case "reserved": return "warning";
      case "sold": return "default";
      case "rejected": return "danger";
      default: return "default";
    }
  };

  return (
    <main className="mx-auto max-w-5xl py-8 pb-28 md:py-12">
      {/* Header Banner */}
      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
        <Avatar src={user?.avatar} fallback={user?.name?.[0]} size="xl" className="h-24 w-24 sm:h-28 sm:w-28" />
        
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.18em] text-primary-600">
            Student Profile {user?.verificationStatus === "verified" && <ShieldCheck className="h-4 w-4" />}
          </p>
          <h1 className="heading mt-2 text-3xl font-extrabold text-slate-900">{user?.name}</h1>
          <p className="mt-1 text-base text-slate-600">
            {user?.campus || "Campus not set"}
            {user?.username && <span className="ml-2 font-medium text-slate-400">@{user.username}</span>}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">{listings.length}</span>
              <span className="text-slate-500">Listings</span>
            </div>
            {user?.sellerStats && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">{user.sellerStats.totalSales || 0}</span>
                <span className="text-slate-500">Sold</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).getFullYear() : "New"}
              </span>
              <span className="text-slate-500">Joined</span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex flex-col gap-2 shrink-0">
            <Button onClick={() => navigate("/sell")} className="gap-2 w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" /> New listing
            </Button>
            <Button variant="secondary" onClick={() => navigate("/account/verify")} className="gap-2 w-full sm:w-auto">
              <ShieldCheck className="h-4 w-4" /> Verification
            </Button>
          </div>
        )}
      </section>

      {/* Tabs Layout */}
      <section className="mt-10">
        <Tabs defaultValue="listings">
          <TabsList className="mb-6">
            <TabsTrigger value="listings">
              {isOwner ? "Your Listings" : "Available Listings"}
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="drafts">Drafts & Review</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="listings">
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                {isOwner ? "Manage items you are currently selling." : "Items currently listed by this student."}
              </p>
            </div>
            
            {listings.filter(l => ["published", "reserved", "sold"].includes(l.status)).length ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {listings.filter(l => ["published", "reserved", "sold"].includes(l.status)).map(item => (
                  <div key={item._id} className="relative group">
                    <ListingCard listing={item} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Package}
                title={isOwner ? "Your shop is empty" : "No active listings"}
                description={isOwner ? "Put useful things back into circulation around campus." : "This student doesn't have any items for sale right now."}
                action={isOwner && <Button onClick={() => navigate("/sell")} className="mt-4">List an item</Button>}
              />
            )}
          </TabsContent>
          
          {isOwner && (
            <TabsContent value="drafts">
              <div className="mb-6">
                <p className="text-sm text-slate-600">Track items that are in draft, pending review, or need edits.</p>
              </div>
              
              {listings.filter(l => !["published", "reserved", "sold"].includes(l.status)).length ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                  {listings.filter(l => !["published", "reserved", "sold"].includes(l.status)).map(item => (
                    <div key={item._id} className="relative opacity-80 hover:opacity-100 transition-opacity">
                      <ListingCard listing={item} />
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-4 text-center">
                        <Badge variant={getStatusVariant(item.status)} className="shadow-lg text-sm px-4 py-1.5">
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Package}
                  title="No drafts or pending items"
                  description="All your submitted listings are processed."
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </section>
    </main>
  );
};

export default MyProfile;
