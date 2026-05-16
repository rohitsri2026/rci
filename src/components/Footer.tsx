import { Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div>
            <a href="#" className="inline-block bg-white p-3 rounded-2xl mb-6 shadow-sm group">
              <Image src="/logo.png" alt="Rohit Computer Institute" width={200} height={80} className="object-contain h-20 w-auto" />
            </a>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Empowering the next generation of tech leaders with industry-aligned education, hands-on training, and career support.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Courses", "Placement", "Contact Us", "Terms & Conditions"].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Popular Courses</h4>
            <ul className="space-y-4">
              {["Basic IT & Office", "Diploma in Computer App", "Advanced Web Development", "Python Programming", "Tally Prime & Accounting", "Digital Marketing"].map((course, i) => (
                <li key={i}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  Sanjay Nagar Cantt, Kanpur, <br />
                  Uttar Pradesh, 208004, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="tel:+917376893097" className="text-slate-400 hover:text-white transition-colors">
                  +91 73768 93097
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href="mailto:info@rcinstitute.com" className="text-slate-400 hover:text-white transition-colors">
                  info@rcinstitute.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Rohit Computer Institute (RCI). All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
