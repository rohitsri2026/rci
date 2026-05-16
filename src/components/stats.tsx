const stats = [
  {
    number: "1500+",
    label: "Students Trained",
  },
  {
    number: "25+",
    label: "Professional Courses",
  },
  {
    number: "5+",
    label: "Years Experience",
  },
  {
    number: "95%",
    label: "Student Satisfaction",
  },
];

export default function Stats() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-10 text-center shadow-sm"
          >
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {item.number}
            </h2>

            <p className="mt-4 text-slate-600 font-medium">
              {item.label}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}
