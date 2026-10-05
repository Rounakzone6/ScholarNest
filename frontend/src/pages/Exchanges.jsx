import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { ArrowRightLeft, ShieldCheck, Clock, MapPin, Search } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { Avatar } from "../components/ui/Avatar";

const Exchanges = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/orders/mine`, { headers: { token } });
      if (data.success) setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    load();
  }, [token, navigate, load]);

  const act = async (order, action) => {
    setBusy(order._id);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/orders/update`,
        { orderId: order._id, action },
        { headers: { token } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setBusy("");
    }
  };

  const statusMap = {
    reserved: { label: "Reserved", variant: "warning" },
    ready_for_pickup: { label: "Ready for Pickup", variant: "primary" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "danger" },
    disputed: { label: "Disputed", variant: "danger" }
  };

  const buyingOrders = orders.filter(o => o.viewerRole === "buyer");
  const sellingOrders = orders.filter(o => o.viewerRole === "seller");

  const OrderCard = ({ order, buyer }) => {
    const role = buyer ? "Buying" : "Selling";
    const other = buyer ? order.sellerId : order.buyerId;
    const listing = order.listingId || {};
    const statusConfig = statusMap[order.orderStatus] || { label: order.orderStatus, variant: "default" };

    return (
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          {/* Image Sidebar */}
          <div className="relative aspect-video w-full bg-slate-100 sm:aspect-auto sm:w-48 sm:shrink-0">
            <img 
              src={listing.images?.[0] || "/vite.svg"} 
              alt="" 
              className="h-full w-full object-cover" 
            />
            <div className="absolute left-3 top-3 flex gap-1.5 sm:hidden">
              <Badge variant="default" className="bg-slate-900/70 text-white backdrop-blur-md">{role}</Badge>
              <Badge variant={statusConfig.variant} className="shadow-sm">{statusConfig.label}</Badge>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="mb-4 hidden items-center justify-between gap-4 sm:flex">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-slate-100">{role}</Badge>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </div>
              <span className="text-xs font-semibold text-slate-400">Order #{order.orderNumber}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h3 className="heading text-lg font-bold text-slate-900">
                  {listing.title || "Listing unavailable"}
                </h3>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                  ₹{Number(order.amount).toLocaleString("en-IN")}
                </p>
                
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Avatar src={other?.avatar} fallback={other?.name?.[0]} size="sm" />
                    <span>{buyer ? "Seller" : "Buyer"}: <strong className="text-slate-900">{other?.name || "Student"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{order.pickupLocation || listing.campus || "Campus Meetup"}</span>
                  </div>
                  {other?.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-medium text-slate-900">Contact:</span> {other.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full shrink-0 flex-col gap-2 border-t border-slate-100 pt-4 sm:w-auto sm:border-0 sm:pt-0">
                {!buyer && order.orderStatus === "reserved" && (
                  <Button disabled={busy === order._id} isLoading={busy === order._id} onClick={() => act(order, "ready")}>
                    Ready for pickup
                  </Button>
                )}
                {buyer && (order.orderStatus === "ready_for_pickup" || order.orderStatus === "reserved") && (
                  <Button variant="success" disabled={busy === order._id} isLoading={busy === order._id} onClick={() => act(order, "complete")}>
                    Confirm received
                  </Button>
                )}
                {order.orderStatus === "reserved" && (
                  <Button variant="secondary" disabled={busy === order._id} isLoading={busy === order._id} onClick={() => act(order, "cancel")}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="flex items-start gap-2 bg-slate-50 px-5 py-3 text-xs leading-5 text-slate-600 sm:px-6">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            Payment is handled in person between students. Meet somewhere public on campus and confirm the item condition before completing the exchange.
          </p>
        </div>
      </article>
    );
  };

  return (
    <main className="mx-auto max-w-5xl py-8 pb-28 md:py-12">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary-600">Student transactions</p>
        <h1 className="heading text-3xl font-extrabold text-slate-900 sm:text-4xl">Exchanges & Orders</h1>
        <p className="mt-2 text-lg text-slate-600">Coordinate local handoffs and keep track of items you’ve reserved or sold.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((x) => <Skeleton key={x} className="h-48 w-full rounded-3xl" />)}
        </div>
      ) : !orders.length ? (
        <EmptyState 
          icon={ArrowRightLeft}
          title="Your first exchange is waiting."
          description="Find something useful from another student, or list an item of your own."
          action={<Button onClick={() => navigate("/browse")} className="mt-2">Browse marketplace</Button>}
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Exchanges ({orders.length})</TabsTrigger>
            <TabsTrigger value="buying">Buying ({buyingOrders.length})</TabsTrigger>
            <TabsTrigger value="selling">Selling ({sellingOrders.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-5">
            {orders.map(order => <OrderCard key={order._id} order={order} buyer={order.viewerRole === "buyer"} />)}
          </TabsContent>
          <TabsContent value="buying" className="space-y-5">
            {buyingOrders.map(order => <OrderCard key={order._id} order={order} buyer={true} />)}
            {buyingOrders.length === 0 && <EmptyState icon={Search} title="No buying exchanges" description="You haven't reserved any items yet." />}
          </TabsContent>
          <TabsContent value="selling" className="space-y-5">
            {sellingOrders.map(order => <OrderCard key={order._id} order={order} buyer={false} />)}
            {sellingOrders.length === 0 && <EmptyState icon={Search} title="No selling exchanges" description="No one has reserved your items yet." />}
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
};

export default Exchanges;
