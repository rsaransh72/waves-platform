"use client";

import { useRouter } from "next/navigation";
import { SuiteEditor } from "./SuiteEditor";

export function SuiteEditorRoute({ initialData, isNew }: { initialData: unknown; isNew: boolean }) {
  const router = useRouter();

  return (
    <SuiteEditor
      initialData={initialData}
      isNew={isNew}
      onClose={() => router.push("/admin/suites")}
    />
  );
}