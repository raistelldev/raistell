import { Suspense } from "react";
import type { Metadata } from "next";
import { ThankYouContent } from "@/components/ThankYouContent";

export const metadata: Metadata = {
  title: "Danke",
  description: "Ihre Anfrage ist bei uns angekommen.",
  robots: { index: false, follow: false },
};

export default function DankePage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center bg-dark px-4 py-28">
          <p className="text-on-dark/70">Einen Moment …</p>
        </main>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
