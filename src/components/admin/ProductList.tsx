"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Filter, Edit2, Trash2, EyeOff, CheckCircle, Eye, Plus } from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase-browser";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "./Drawer";
import { ProductEditor } from "./ProductEditor";

export function ProductList({ initialProducts }: { initialProducts: any[] }) {
  const { products, setProducts, removeProduct, updateProduct } = useAdminStore();
  
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts, setProducts]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const productData = useMemo(() => Object.values(products.data), [products.data]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    // Optimistic Delete
    removeProduct(id);
    toast.success(`Deleted ${title}`);
    
    // Background execution
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error deleting product: ${err.message}`);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "disabled" : "published";
    
    // Optimistic Update
    updateProduct(id, { status: newStatus });
    toast.success(`Status changed to ${newStatus}`);

    // Background execution
    try {
      const supabase = createClient();
      const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error updating product status: ${err.message}`);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.original.title}</span>
          {row.original.status === "published" ? (
            <a href={`/${row.original.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline">/{row.original.slug} · view on site ↗</a>
          ) : (
            <span className="text-xs font-medium text-slate-500">/{row.original.slug} · not on the website</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        row.original.category ? (
          <span className="inline-flex items-center rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200">
            {row.original.category}
          </span>
        ) : (
          <span className="text-slate-400 font-bold">-</span>
        )
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColors: Record<string, string> = {
          published: "text-emerald-700 bg-emerald-50 border-emerald-200",
          draft: "text-amber-700 bg-amber-50 border-amber-200",
          disabled: "text-red-700 bg-red-50 border-red-200",
          archived: "text-slate-600 bg-slate-100 border-slate-300",
        };
        const sColor = statusColors[row.original.status] || statusColors.draft;
        return (
          <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shadow-sm", sColor)}>
            {row.original.status === "published" && <CheckCircle className="h-3 w-3" />}
            {row.original.status === "disabled" && <EyeOff className="h-3 w-3" />}
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-500">
          {new Date(row.original.created_at).toLocaleDateString("en-CA")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const isPublished = row.original.status === "published";
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleToggleStatus(row.original.id, row.original.status)}
              title={isPublished ? "Disable Product" : "Enable Product"}
              className={clsx(
                "p-2 rounded transition-colors",
                isPublished ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
              )}
            >
              {isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => {
                setSelectedProduct(row.original);
                setIsDrawerOpen(true);
              }}
              title="Edit Product"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDelete(row.original.id, row.original.title)}
              title="Delete Product"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="text-sm font-medium text-slate-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsDrawerOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <DataTable 
          columns={columns} 
          data={productData} 
          searchKey="title"
          disablePagination={true}
          filters={[
            {
              key: "status",
              label: "All Statuses",
              options: [
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
                { label: "Disabled", value: "disabled" },
                { label: "Archived", value: "archived" }
              ]
            }
          ]}
        />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProduct ? "Edit Product" : "New Product"}
      >
        {isDrawerOpen && (
          <ProductEditor 
            initialData={selectedProduct || {}} 
            isNew={!selectedProduct}
            onClose={() => setIsDrawerOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
