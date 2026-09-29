"use client";

import { useState } from "react";
import { 
  GraduationCap, 
  Hospital, 
  Store, 
  Layers, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

interface BookDemoFormProps {
  defaultProduct?: "school-erp" | "hospital-erp" | "pharmacy-pos" | "all" | "erp";
  compact?: boolean;
}

const PRODUCTS = [
  {
    id: "erp",
    name: "Waves ERP",
    desc: "Financials, Supply Chain & GST",
    icon: Layers,
  },
  {
    id: "school-erp",
    name: "Waves School Suite",
    desc: "Fees, WhatsApp & CBSE Marks",
    icon: GraduationCap,
  },
  {
    id: "hospital-erp",
    name: "Waves Health Suite",
    desc: "OPD/IPD, Beds & Prescriptions",
    icon: Hospital,
  },
  {
    id: "pharmacy-pos",
    name: "Waves Pharmacy POS",
    desc: "Barcode POS & Expiry Tracker",
    icon: Store,
  },
  {
    id: "all",
    name: "Waves One (Unified)",
    desc: "All-in-One Institutional ERP",
    icon: Layers,
  },
];

export default function BookDemoForm({ defaultProduct = "school-erp", compact = false }: BookDemoFormProps) {
  const [product, setProduct] = useState<string>(defaultProduct);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          organization,
          product,
          teamSize,
          city,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit demo request.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please call +91 98765 43210.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#e6e9f0] rounded-[6px] p-8 sm:p-10 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-bold text-[#111111] tracking-tight">
          Demo Request Confirmed!
        </h3>
        <p className="text-[14px] text-[#404040] mt-2 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-[#111111]">{fullName}</strong>. An enterprise solution architect will contact you at <span className="font-semibold text-[#111111]">+91 {phone}</span> within 2 hours.
        </p>
        <div className="mt-6 pt-6 border-t border-[#e6e9f0] text-xs text-[#7d7d7d]">
          Need immediate support? Call our engineering desk directly at{" "}
          <a href="tel:+919876543210" className="text-[#0066cc] font-bold hover:underline">
            +91 98765 43210
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e6e9f0] rounded-[6px] p-6 sm:p-8 shadow-xs">
      <div className="border-b border-[#e6e9f0] pb-4 mb-6">
        <h3 className="text-[22px] font-bold text-[#111111] tracking-tight">
          Request a Live Walkthrough & 14-Day Pilot
        </h3>
        <p className="text-xs sm:text-[13px] text-[#404040] mt-1">
          Zero commitment. We configure a custom sandbox with your school or hospital data in 24 hours.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product selector */}
        <div>
          <label className="block text-xs font-bold text-[#333333] uppercase tracking-wider mb-2">
            SELECT YOUR SOFTWARE SUITE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRODUCTS.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = product === p.id;
              const isLast = idx === PRODUCTS.length - 1;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setProduct(p.id)}
                  className={`p-3 rounded-[4px] border text-left transition cursor-pointer flex items-start space-x-2.5 ${
                    isLast ? "sm:col-span-2" : ""
                  } ${
                    isSelected
                      ? "border-[#0066cc] bg-blue-50/40 shadow-xs"
                      : "border-[#e6e9f0] hover:border-[#cccccc] bg-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-[#0066cc]" : "text-[#7d7d7d]"}`} />
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-[#0066cc]" : "text-[#111111]"}`}>
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#7d7d7d] leading-tight mt-0.5">
                      {p.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name and Phone */}
        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              Phone / WhatsApp Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7d7d7d] text-xs font-medium">
                +91
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full h-[52px] pl-11 pr-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Work Email and Organization */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              Work / Official Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="director@institution.com"
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              School / Hospital / Pharmacy Name *
            </label>
            <input
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Apex Public School / City Clinic"
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
            />
          </div>
        </div>

        {/* City and Capacity */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              City / State
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Lucknow, Uttar Pradesh"
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333333] mb-1">
              Scale / Capacity
            </label>
            <select
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="w-full h-[52px] px-4 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition bg-white text-[#111111] cursor-pointer"
            >
              <option value="">Select Scale</option>
              <option value="sme_business">10 – 50 Users (Growing Business / Trading)</option>
              <option value="enterprise_erp">50+ Users (Manufacturing / Enterprise ERP)</option>
              <option value="under_500">Under 500 Students / Beds</option>
              <option value="500_2000">500 – 2,000 Students / Beds</option>
              <option value="above_2000">2,000+ Students / Group Trust</option>
              <option value="single_pharmacy">Single Retail Chemist Shop</option>
              <option value="chain_pharmacy">Multi-Branch Pharmacy Chain</option>
            </select>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#333333] mb-1">
            Current Software or Specific Requirements (Optional)
          </label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Moving from Tally/Marg, need WhatsApp fee receipts, RFID turnstiles..."
            className="w-full p-3.5 rounded-[6px] border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] text-[14px] outline-none transition placeholder:text-[#888888] bg-white text-[#111111]"
          />
        </div>

        {/* Zoho-Style Flat Red Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-[#e42525] hover:bg-[#d60012] text-white font-bold text-[14px] uppercase tracking-wider rounded-[4px] transition flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>CONFIRMING WALKTHROUGH...</span>
              </span>
            ) : (
              <span>CONFIRM & BOOK FREE DEMO</span>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-[#7d7d7d]">
          Zero credit card required • Includes 14-day full pilot & free legacy data migration.
        </p>
      </form>
    </div>
  );
}
