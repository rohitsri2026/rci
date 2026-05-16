import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyCertificate from "@/components/VerifyCertificate";

export const metadata = { title: "Verify Certificate | Rohit Computer Institute", description: "Verify the authenticity of an RCI certificate by entering the unique Certificate ID." };

export default function VerifyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 pt-32 pb-20">
        <VerifyCertificate />
      </main>
      <Footer />
    </>
  );
}
