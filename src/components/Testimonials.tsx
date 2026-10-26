"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const testimonials = [
  {
    name: "Aman Gupta",
    course: "Advanced Web Development",
    role: "Full Stack Developer",
    content: "RCI's web development course completely transformed my career trajectory. The practical hands-on coding labs and teacher guidance gave me full technical confidence to clear my software interviews.",
    rating: 5,
    verified: true,
  },
  {
    name: "Priya Sharma",
    course: "Tally Prime & GST Accounting",
    role: "Accounts Executive",
    content: "The faculty at Rohit Computer Institute taught me computerized accounting, GST billing, and real voucher entry. The QR-verifiable certificate helped me secure an immediate accounting job in Kanpur!",
    rating: 5,
    verified: true,
  },
  {
    name: "Rahul Verma",
    course: "Diploma in Computer Application (DCA)",
    role: "Computer Operator & DTP Specialist",
    content: "I started with zero computer knowledge. The DCA diploma gave me thorough command over MS Office, Photoshop, PageMaker, and internet tools. Teachers are incredibly patient and supportive.",
    rating: 5,
    verified: true,
  },
  {
    name: "Neha Singh",
    course: "Python Programming & Data Basics",
    role: "Junior Programmer",
    content: "Learning Python logic and algorithms at RCI was an amazing experience. The individual workstation practice allowed me to build real-world Python automation scripts and mini-projects.",
    rating: 5,
    verified: true,
  },
  {
    name: "Vikas Patel",
    course: "ADCA (Advance Diploma)",
    role: "IT Support Specialist",
    content: "ADCA covered everything from advanced Excel formulas to hardware fundamentals and graphic design. The flexible batch timing made it easy to balance my college and institute studies.",
    rating: 5,
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-12 sm:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#155EEF] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-2.5 animate__animated animate__fadeIn">
              <i className="bi bi-patch-check-fill text-[#D4A72C] text-xs" />
              <span>Real Student Reviews</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-[#07152F] tracking-tight leading-tight">
              Student Success Stories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal leading-relaxed">
              Hear from graduates who learned practical computer skills and launched their professional careers at RCI.
            </p>
          </div>

          {/* Navigation Arrows with Font Awesome */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous testimonials"
              className="testimonials-swiper-prev w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-[#155EEF] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              className="testimonials-swiper-next w-9 h-9 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-[#155EEF] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        </div>

        {/* Swiper Carousel for Mobile & Desktop */}
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: ".testimonials-swiper-next",
            prevEl: ".testimonials-swiper-prev",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="pb-12 swiper-pagination-dark"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="h-full bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <i className="bi bi-quote text-3xl text-blue-400 group-hover:text-[#155EEF] transition-colors" />
                    
                    {/* 5 Stars with Font Awesome */}
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star text-xs text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#155EEF] to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[#07152F] font-extrabold text-xs sm:text-sm leading-snug flex items-center gap-1.5">
                      <span className="truncate">{testimonial.name}</span>
                      <i className="bi bi-patch-check-fill text-blue-600 text-xs" title="Verified Alumni" />
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium flex items-center gap-1 truncate mt-0.5">
                      <i className="fa-solid fa-graduation-cap text-[#155EEF] text-[10px]" />
                      <span>{testimonial.course}</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
