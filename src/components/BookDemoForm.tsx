"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface BookDemoFormProps {
  defaultProduct?: "school-erp" | "hospital-erp" | "pharmacy-pos" | "all" | "erp" | "";
  compact?: boolean;
}

export default function BookDemoForm({ defaultProduct = "", compact = false }: BookDemoFormProps) {
  const [product, setProduct] = useState<string>(defaultProduct);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
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
          message: "Demo requested via minimal Zoho-style form",
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
      <div className="bg-white border border-[#e6e9f0] rounded-[4px] p-8 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-[20px] font-bold text-[#111111] tracking-tight">
          Demo Request Confirmed
        </h3>
        <p className="text-[14px] text-[#404040] mt-2 leading-relaxed">
          Thank you. An enterprise solution architect will contact you at <span className="font-semibold text-[#111111]">+91 {phone}</span> shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e6e9f0] rounded-[4px] p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h3 className="text-[24px] font-semibold text-[#111111] tracking-tight">
          Request a Demo
        </h3>
        <p className="text-[14px] text-[#555555] mt-1.5">
          Fill out the form below and our product experts will get in touch with you shortly.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-semibold text-[#111111] mb-1.5">
            Full Name <span className="text-[#e42525]">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]"
          />
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-[13px] font-semibold text-[#111111] mb-1.5">
            Work Email <span className="text-[#e42525]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[13px] font-semibold text-[#111111] mb-1.5">
            Phone Number <span className="text-[#e42525]">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]"
          />
        </div>

        {/* Organization */}
        <div>
          <label className="block text-[13px] font-semibold text-[#111111] mb-1.5">
            Company Name <span className="text-[#e42525]">*</span>
          </label>
          <input
            type="text"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] outline-none transition bg-white text-[#111111]"
          />
        </div>

        {/* Product Interest (Custom Dropdown) */}
        <div className="relative">
          <label className="block text-[13px] font-semibold text-[#111111] mb-1.5">
            Product Interest <span className="text-[#e42525]">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                // We'll toggle a local state for the dropdown open/close
                const dropdown = document.getElementById("product-dropdown-menu");
                if (dropdown) {
                  dropdown.classList.toggle("hidden");
                }
              }}
              className="w-full h-[40px] px-3 border border-[#cccccc] focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] rounded-[3px] text-[14px] bg-white text-left flex items-center justify-between transition cursor-pointer"
            >
              <span className={product ? "text-[#111111]" : "text-[#888888]"}>
                {product === "erp" ? "Waves ERP" :
                 product === "school-erp" ? "Waves School Suite" :
                 product === "hospital-erp" ? "Waves Health Suite" :
                 product === "pharmacy-pos" ? "Waves Pharmacy POS" :
                 product === "all" ? "Waves One (Unified)" : "Select a product..."}
              </span>
              <svg className="w-4 h-4 text-[#777777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Custom Dropdown Menu */}
            <div id="product-dropdown-menu" className="hidden absolute z-50 w-full mt-1 bg-white border border-[#cccccc] rounded-[3px] shadow-lg max-h-60 overflow-y-auto">
              {[
                { id: "erp", label: "Waves ERP" },
                { id: "school-erp", label: "Waves School Suite" },
                { id: "hospital-erp", label: "Waves Health Suite" },
                { id: "pharmacy-pos", label: "Waves Pharmacy POS" },
                { id: "all", label: "Waves One (Unified)" }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    setProduct(opt.id);
                    document.getElementById("product-dropdown-menu")?.classList.add("hidden");
                  }}
                  className={`px-3 py-2.5 text-[14px] cursor-pointer hover:bg-[#f5f7fa] transition ${product === opt.id ? "bg-blue-50 text-[#0066cc] font-medium" : "text-[#111111]"}`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 h-[44px] bg-[#e42525] hover:bg-[#d60012] text-white font-semibold text-[14px] uppercase tracking-wide rounded-[3px] transition flex items-center justify-center cursor-pointer disabled:opacity-70 shadow-sm"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PLEASE WAIT...</span>
              </span>
            ) : (
              <span>REQUEST DEMO</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
