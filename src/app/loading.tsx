import InstituteLoader from "@/components/ui/InstituteLoader";

export default function Loading() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[70vh] bg-slate-50">
      <InstituteLoader
        size="lg"
        title="Rohit Computer Institute"
        subtitle="Loading institute page & curriculum..."
        showBadge={true}
      />
    </main>
  );
}
