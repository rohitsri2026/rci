const reasons = [
  "Modern Computer Labs",
  "Experienced Faculty",
  "Industry-Oriented Courses",
  "Affordable Fees Structure",
  "Certificate Verification System",
  "Career Guidance & Support",
];

export default function WhyRCI() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-black text-slate-900">
          Why Choose RCI
        </h2>

        <p className="mt-6 text-slate-600 max-w-2xl mx-auto">
          We provide practical education, modern infrastructure,
          and career-focused training for students.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-16">

          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-600 rounded-full shrink-0" />

                <p className="text-lg font-medium text-slate-800">
                  {item}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
