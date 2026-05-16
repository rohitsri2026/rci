"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const courses = [
  {
    title: "Web Development",
    image: "/courses/web-dev.jpg",
    duration: "6 Months",
    fees: "₹5999",
  },
  {
    title: "Graphic Designing",
    image: "/courses/graphic.jpg",
    duration: "4 Months",
    fees: "₹3999",
  },
  {
    title: "Tally Prime",
    image: "/courses/tally.jpg",
    duration: "3 Months",
    fees: "₹2999",
  },
  {
    title: "DCA Course",
    image: "/courses/dca.jpg",
    duration: "12 Months",
    fees: "₹6999",
  },
  {
    title: "Python Programming",
    image: "/courses/python.jpg",
    duration: "5 Months",
    fees: "₹4999",
  },
  {
    title: "Typing Course",
    image: "/courses/typing.jpg",
    duration: "2 Months",
    fees: "₹1499",
  },
];

export default function CoursesSlider() {
  return (
    <section className="py-28 px-6 bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <span className="text-violet-400 uppercase tracking-widest font-semibold">
            Courses Offered
          </span>

          <h2 className="text-4xl md:text-6xl font-black mt-4 text-white">
            Upgrade Your Skills With RCI
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Industry-oriented courses designed to build practical
            computer and IT skills for modern careers.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16"
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:scale-[1.02] transition duration-300">

                <div className="relative h-[250px] overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between mt-6 text-gray-400">
                    <span>{course.duration}</span>

                    <span className="text-violet-400 font-bold">
                      {course.fees}
                    </span>
                  </div>

                  <button className="mt-8 w-full bg-violet-600 hover:bg-violet-700 transition py-4 rounded-xl font-semibold text-white">
                    Enroll Now
                  </button>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}
