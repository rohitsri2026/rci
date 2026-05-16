export default function AboutHero() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-slate-900">
          About{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Rohit Computer Institute
          </span>
        </h1>

        <p className="mt-8 text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
          Rohit Computer Institute (RCI) is committed to providing
          high-quality computer education and practical IT skills
          that empower students for successful careers in the
          digital world.
        </p>
      </div>
    </section>
  );
}
