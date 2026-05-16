import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = { title: "Contact Us | Rohit Computer Institute", description: "Get in touch with Rohit Computer Institute. Find our address, phone number, and email." };

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Contact Us</h1>
            <p className="text-slate-600 text-lg">We'd love to hear from you. Reach out to us through any of the channels below.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Address", value: "Sanjay Nagar Cantt, Kanpur,\nUttar Pradesh - 208004", color: "text-blue-600", bg: "bg-blue-100" },
                { icon: Phone, label: "Phone", value: "+91 73768 93097", color: "text-green-600", bg: "bg-green-100" },
                { icon: Mail, label: "Email", value: "info@rcinstitute.com", color: "text-purple-600", bg: "bg-purple-100" },
                { icon: Clock, label: "Working Hours", value: "Monday to Saturday\n8:00 AM – 8:00 PM", color: "text-orange-600", bg: "bg-orange-100" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex gap-5">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">{item.label}</p>
                    <p className="text-slate-900 font-medium whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Embed */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full min-h-[400px]">
              <iframe
                title="RCI Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.234!2d80.3319!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDI2JzU5LjYiTiA4MMKwMTknNTQuOSJF!5e0!3m2!1sen!2sin!4v1678000000000"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
