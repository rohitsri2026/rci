"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-red-50 rounded-full mb-6 border border-red-100">
          <AlertTriangle className="size-16 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Something went wrong!
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          We encountered an unexpected error. Please try again or contact support if the issue persists.
        </p>
        <Button 
          onClick={() => reset()}
          size="lg" 
          variant="outline"
          className="gap-2 rounded-full border-slate-300 hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCcw className="size-4" />
          Try again
        </Button>
      </motion.div>
    </div>
  );
}
