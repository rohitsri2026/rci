"use client";

import { motion } from "framer-motion";
import { Quote, Star, GraduationCap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Aman Gupta",
    course: "Advanced Web Development",
    role: "Software Developer",
    content: "RCI's web development course completely transformed my career skills. The hands-on coding practice and teacher guidance gave me full technical confidence.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    course: "Tally Prime & GST Accounting",
    role: "Accounts Executive",
    content: "The faculty at Rohit Computer Institute taught me computerized accounting, GST billing, and voucher entry. Highly recommended for accounting beginners!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    course: "Diploma in Computer Application (DCA)",
    role: "Computer Operator",
    content: "I started with zero computer knowledge. The DCA diploma gave me thorough command over MS Office, DTP, and internet tools. Very supportive teachers.",
    rating: 5,
  },
  {
    name: "Neha Singh",
    course: "Python Programming",
    role: "Junior Programmer",
    content: "Learning Python logic and algorithms at RCI was an amazing experience. The practical lab sessions allowed me to build actual Python projects.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-18 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
            Alumni Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-slate-900 mt-4 mb-4 leading-tight">
            Student Success Stories
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hear from our students who built practical computer skills and launched their technical careers at RCI.
          </p>
        </div>

        {/* Swiper Carousel for Mobile & Desktop */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="w-10 h-10 text-blue-200" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-8 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold text-base leading-snug">{testimonial.name}</h4>
                    <p className="text-blue-600 text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {testimonial.course}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
