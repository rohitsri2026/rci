import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="size-12 animate-spin text-blue-600" />
      <p className="text-lg font-medium text-slate-600 animate-pulse">Loading...</p>
    </div>
  );
}
