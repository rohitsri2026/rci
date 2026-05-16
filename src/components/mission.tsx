export default function Mission() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">

        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-slate-900">
            Our Vision
          </h2>

          <p className="text-slate-600 leading-relaxed">
            To become one of the most trusted computer education
            institutes by delivering high-quality technical training
            and empowering students with digital skills.
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-6 text-slate-900">
            Our Mission
          </h2>

          <p className="text-slate-600 leading-relaxed">
            To provide affordable and practical computer education
            that bridges the gap between learning and real-world
            industry requirements.
          </p>
        </div>

      </div>
    </section>
  );
}
