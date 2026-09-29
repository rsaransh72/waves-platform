import React from "react";
import { ShoppingCart, Barcode, PackageSearch, AlertTriangle, IndianRupee, Store } from "lucide-react";

export default function PharmacyDashboardDemo() {
  return (
    <div className="w-full bg-[#f8f9fa] rounded-xl overflow-hidden border border-[#e6e9f0] shadow-sm font-sans select-none">
      {/* Mac Browser Header */}
      <div className="h-10 bg-white border-b border-[#e6e9f0] flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="mx-auto bg-[#f1f3f5] rounded-md h-6 w-1/2 flex items-center justify-center">
          <span className="text-[11px] text-[#888] font-medium tracking-wide">waves.store / pos</span>
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-48 bg-white border-r border-[#e6e9f0] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="w-6 h-6 rounded bg-[#d88900] text-white flex items-center justify-center">
              <Store className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="text-[13px] font-bold text-[#111]">Pharmacy POS</span>
          </div>
          
          <div className="px-2 py-1.5 bg-[#fff7e6] text-[#d88900] rounded flex items-center gap-2 mb-1">
            <ShoppingCart className="w-4 h-4" />
            <span className="text-[12px] font-semibold">Active Cart</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <PackageSearch className="w-4 h-4" />
            <span className="text-[12px] font-medium">Inventory</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[12px] font-medium">Expiry Alerts</span>
            <span className="ml-auto bg-[#ff4d4f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </div>
          <div className="px-2 py-1.5 text-[#555] rounded flex items-center gap-2 hover:bg-[#f8f9fa]">
            <IndianRupee className="w-4 h-4" />
            <span className="text-[12px] font-medium">Day Register</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#fafbfc] overflow-hidden">
          
          {/* Barcode Search Bar */}
          <div className="p-4 border-b border-[#e6e9f0] bg-white flex items-center gap-4">
            <div className="flex-1 bg-[#f1f3f5] rounded-md px-3 py-2 flex items-center gap-2 border border-transparent focus-within:border-[#d88900] focus-within:bg-white transition-colors">
              <Barcode className="w-5 h-5 text-[#888]" />
              <div className="text-[13px] text-[#888] font-mono">Scan barcode or search medicine... (F2)</div>
            </div>
            <div className="px-4 py-2 bg-[#d88900] text-white text-[13px] font-bold rounded-md shadow-sm">
              F9 - Checkout
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Cart Items */}
            <div className="flex-1 p-0 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e6e9f0] text-[11px] font-bold text-[#888] uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold">Item</th>
                    <th className="px-4 py-3 font-semibold">Batch</th>
                    <th className="px-4 py-3 font-semibold text-right">Qty</th>
                    <th className="px-4 py-3 font-semibold text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f1f3f5] bg-white">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-semibold text-[#111]">Augmentin 625 Duo Tablet</div>
                      <div className="text-[11px] text-[#666]">Amoxicillin + Clavulanic Acid</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-[#555]">AB1234X</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-center border border-[#e6e9f0] rounded w-8 h-6 text-[12px] font-semibold">
                        2
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-semibold text-[#111]">₹402.50</td>
                  </tr>
                  <tr className="border-b border-[#f1f3f5] bg-white">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-semibold text-[#111]">Dolo 650 Tablet</div>
                      <div className="text-[11px] text-[#666]">Paracetamol (650mg)</div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-mono text-[#555]">DL9921Y</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center justify-center border border-[#e6e9f0] rounded w-8 h-6 text-[12px] font-semibold">
                        5
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[13px] font-semibold text-[#111]">₹154.20</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Panel */}
            <div className="w-56 bg-white border-l border-[#e6e9f0] p-4 flex flex-col">
              <h3 className="text-[12px] font-bold text-[#888] uppercase tracking-wider mb-4">Order Summary</h3>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[#555]">Subtotal</span>
                <span className="text-[13px] font-semibold text-[#111]">₹556.70</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] text-[#555]">CGST (6%)</span>
                <span className="text-[13px] font-semibold text-[#111]">₹33.40</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#e6e9f0]">
                <span className="text-[13px] text-[#555]">SGST (6%)</span>
                <span className="text-[13px] font-semibold text-[#111]">₹33.40</span>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-[15px] font-bold text-[#111]">Total</span>
                <span className="text-[20px] font-bold text-[#d88900]">₹623.50</span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2">
                <button className="py-2 bg-[#f1f3f5] text-[#555] rounded text-[12px] font-bold">UPI</button>
                <button className="py-2 bg-[#d88900] text-white rounded text-[12px] font-bold shadow-sm">CASH</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
