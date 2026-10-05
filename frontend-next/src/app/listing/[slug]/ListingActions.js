"use client";

import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { MessageCircle, Heart, Share, Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ShopContext } from "@/context/ShopContext";
import axios from "axios";

export default function ListingActions({ listingId, status }) {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [reserving, setReserving] = useState(false);

  const handleMessage = () => toast.info("Messaging will be available soon.");
  const handleSave = () => token ? toast.info("Saved listings coming soon.") : navigate("/login");
  const handleReport = () => toast.info("Reports will be available soon.");

  const handleReserve = async () => {
    if (!token) return navigate("/login");
    setReserving(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/orders/reserve`,
        { listingId },
        { headers: { token } }
      );
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Could not reserve this item.");
    } finally {
      setReserving(false);
    }
  };

  const copyLink = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(url).then(() => toast.success("Link copied"));
      } else {
        toast.info(url);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={handleMessage}
          className="w-full gap-2"
        >
          <MessageCircle className="h-5 w-5" /> Message seller
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleReserve}
          disabled={reserving || status !== "published"}
          isLoading={reserving}
          className="w-full"
        >
          {status === "published" ? "Reserve & Arrange Pickup" : `Item ${status}`}
        </Button>
        <p className="text-center text-xs font-medium text-slate-500">
          No money moves until you meet the seller.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-slate-50" onClick={handleSave}>
          <Heart className="h-5 w-5" />
          <span className="text-[10px]">Save</span>
        </Button>
        <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-slate-50" onClick={copyLink}>
          <Share className="h-5 w-5" />
          <span className="text-[10px]">Share</span>
        </Button>
        <Button variant="ghost" className="flex-col gap-1 text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={handleReport}>
          <Flag className="h-5 w-5" />
          <span className="text-[10px]">Report</span>
        </Button>
      </div>
    </>
  );
}
