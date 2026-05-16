import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyForm from "@/components/VerifyForm";

export const metadata: Metadata = {
  title: "Verify Certificate | Rohit Computer Institute",
  description: "Verify the authenticity of an RCI certificate by entering the unique Certificate ID.",
};

export default function VerifyPage() {
  return (
    <>
      <Header />
      <VerifyForm />
      <Footer />
    </>
  );
}
