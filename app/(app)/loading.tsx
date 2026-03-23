import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 blur-xl opacity-20 bg-primary animate-pulse" />
        <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted animate-pulse tracking-wide">
        PREPARING CONTENT...
      </p>
    </div>
  );
}
