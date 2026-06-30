import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "تم تأكيد الدفع - بوصلة المستقل" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        value: 199.0,
        currency: "EGP",
        content_name: "بوصلة المستقل",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-12" dir="rtl">
      <div className="mx-auto max-w-xl w-full text-center bg-card rounded-3xl shadow-elegant border border-border p-8 sm:p-12">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#1D9E75] text-white shadow-lg">
          <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold text-navy leading-snug">
          مبروك يا بطل! تم تأكيد الدفع بنجاح 🎉
        </h1>
        <p className="mt-4 text-base sm:text-lg text-navy/75 leading-relaxed">
          تقدر دلوقتي تفتح الكتيب وتبدأ رحلتك في العمل الحر.
        </p>
        <a
          href="https://30daysworkwithai.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-5 text-lg sm:text-xl font-extrabold text-navy shadow-xl transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
        >
          الذهاب لنسخة الكتيب بتاعك 🚀
        </a>
      </div>
    </div>
  );
}
