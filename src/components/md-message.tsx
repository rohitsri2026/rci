import Image from "next/image";

export default function MDMessage() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full" />

          <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/md-photo.png"
              alt="Managing Director"
              width={400}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-blue-600 font-semibold uppercase tracking-widest text-sm">
            Managing Director Message
          </span>

          <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight text-slate-900">
            Empowering Students Through Technology & Skills
          </h2>

          <p className="mt-8 text-slate-600 leading-relaxed text-lg">
            At Rohit Computer Institute, our mission is to provide
            practical and industry-relevant computer education to
            every student. We believe that technology education is
            the key to future success.
          </p>

          <p className="mt-6 text-slate-600 leading-relaxed text-lg">
            Our institute focuses on skill development, professional
            training, and career-oriented learning that helps
            students become confident and job-ready professionals.
          </p>

          <div className="mt-10">
            <h3 className="text-2xl font-bold text-slate-900">
              Rohit Srivastava
            </h3>

            <p className="text-blue-600 mt-1 font-medium">
              Managing Director, RCI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
