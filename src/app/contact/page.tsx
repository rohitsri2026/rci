import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Navigation, 
  ExternalLink
} from "lucide-react";
import { RCIConfig } from "@/lib/config";
import WhatsAppCounsellingBanner from "@/components/whatsapp-counselling-banner";

export const metadata: Metadata = {
  title: `Contact Us | ${RCIConfig.instituteName}`,
  description: `Contact ${RCIConfig.instituteName}, Kanpur for course enquiries, admissions, fees, batch timings and computer training information.`,
  alternates: {
    canonical: `${RCIConfig.siteUrl}/contact`,
  },
  openGraph: {
    title: `Contact Us | ${RCIConfig.instituteName}`,
    description: `Get in touch with ${RCIConfig.instituteName}, Kanpur for admissions, course details, and batch timings.`,
    url: `${RCIConfig.siteUrl}/contact`,
    siteName: RCIConfig.instituteName,
    type: "website",
  },
};

export default function ContactPage() {
  const whatsappUrl = RCIConfig.getWhatsAppUrl(
    "Hello RCI, I would like to get more information about your computer courses."
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-28 sm:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {/* 1. HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-7">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              GET IN TOUCH
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mb-3 leading-tight tracking-tight">
              Contact Rohit Computer Institute
            </h1>
            
            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Have questions about courses, fees, batch timings or admission? Reach out to RCI and our team will help you with the next step.
            </p>
          </div>

          {/* 2. QUICK CONTACT ACTIONS STRIP */}
          <div className="max-w-xl mx-auto mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 h-12 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp RCI
              </a>

              <a
                href={`tel:${RCIConfig.phoneRaw}`}
                className="w-full sm:w-auto flex-1 h-12 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-98"
              >
                <Phone className="w-4 h-4" />
                Call RCI
              </a>

              <a
                href={`mailto:${RCIConfig.email}`}
                className="w-full sm:w-auto flex-1 h-12 inline-flex items-center justify-center gap-2 bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-2xs active:scale-98"
              >
                <Mail className="w-4 h-4 text-purple-600" />
                Email RCI
              </a>
            </div>
          </div>

          {/* 3. CONTACT INFORMATION + MAP GRID */}
          <div className="grid lg:grid-cols-12 gap-8 items-start mb-12 sm:mb-16">
            
            {/* LEFT COLUMN: Contact Cards (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Address Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Visit RCI</h3>
                    <p className="text-slate-900 font-extrabold text-sm leading-snug">{RCIConfig.address}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href={RCIConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions →
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Call RCI</h3>
                    <p className="text-slate-900 font-extrabold text-base leading-snug font-mono">{RCIConfig.phoneFormatted}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Direct Institute Helpline</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href={`tel:${RCIConfig.phoneRaw}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Now →
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Email RCI</h3>
                    <p className="text-slate-900 font-extrabold text-sm leading-snug font-mono">{RCIConfig.email}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Official Desk Email</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <a
                    href={`mailto:${RCIConfig.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-purple-700 hover:text-purple-800 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Send Email →
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-all">
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Working Hours</h3>
                    <p className="text-slate-900 font-extrabold text-sm leading-snug">Monday to Saturday</p>
                    <p className="text-slate-600 text-xs font-mono font-semibold mt-0.5">8:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Google Map Embed (7 cols on lg) */}
            <div className="lg:col-span-7 h-full">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-950/5 overflow-hidden flex flex-col h-full min-h-[440px]">
                
                {/* Map Header Strip */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">FIND RCI</span>
                  </div>
                  <a
                    href={RCIConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs"
                  >
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Map Iframe Container */}
                <div className="relative flex-1 min-h-[380px] bg-slate-100">
                  <iframe
                    title="Rohit Computer Institute (RCI) Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.234!2d80.3319!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI2JzU5LjYiTiA4MMKwMTknNTQuOSJF!5e0!3m2!1sen!2sin!4v1678000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "380px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Map Footer Banner */}
                <div className="p-3 bg-slate-900 text-white text-[11.5px] px-4 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Sanjay Nagar Cantt, Kanpur, UP</span>
                  <span className="text-amber-400 font-extrabold text-[10.5px] uppercase tracking-wider">OFFICIAL CAMPUS</span>
                </div>
              </div>
            </div>

          </div>

          {/* 4. REUSABLE WHATSAPP COUNSELING BANNER */}
          <WhatsAppCounsellingBanner
            badge="Admission Counseling"
            title="Need help choosing a course?"
            description="Talk directly with an RCI admissions counselor about courses, fees and batch timings."
            buttonText="Chat with RCI on WhatsApp"
            customMessage="Hello RCI, I would like to get guidance regarding course selection, fees, and batch timings."
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
