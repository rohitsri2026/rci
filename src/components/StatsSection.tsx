"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_STATS } from "@/lib/cms-defaults";
import { HomepageStat } from "@/types/cms";

const ICON_MAP: Record<string, any> = {
  Users,
  BookOpen,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
};

export default function StatsSection() {
  const [stats, setStats] = useState<HomepageStat[]>(DEFAULT_STATS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("homepage_stats")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setStats(data);
      });
  }, []);

  return (
    <section className="py-16 bg-white border-y border-slate-200/80 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, index) => {
            const IconComp = ICON_MAP[item.icon] || Users;
            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-6 sm:p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-600 mx-auto flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                  {item.value}
                </h3>
                <p className="text-sm font-bold text-slate-800 mb-1">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
