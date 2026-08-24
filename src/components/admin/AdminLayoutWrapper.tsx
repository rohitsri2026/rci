"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface AdminLayoutWrapperProps {
  userEmail: string;
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ userEmail, children }: AdminLayoutWrapperProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar Component (Handles fixed desktop & sliding mobile drawer) */}
      <AdminSidebar 
        userEmail={userEmail} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AdminTopBar 
          userEmail={userEmail} 
          onMenuToggle={() => setMobileOpen(!mobileOpen)} 
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
