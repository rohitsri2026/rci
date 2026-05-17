"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="p-4 bg-slate-100 rounded-full mb-6">
          <FileQuestion className="size-16 text-slate-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
            <Home className="size-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
