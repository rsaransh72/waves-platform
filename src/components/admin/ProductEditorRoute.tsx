"use client";

import { useRouter } from "next/navigation";
import { ProductEditor } from "./ProductEditor";

export function ProductEditorRoute({ initialData, isNew }: { initialData: unknown; isNew: boolean }) {
  const router = useRouter();

  return (
    <ProductEditor
      initialData={initialData}
      isNew={isNew}
      onClose={() => router.push("/admin/products")}
    />
  );
}