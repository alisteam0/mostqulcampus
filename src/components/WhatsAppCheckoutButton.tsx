import { useState, FormEvent } from "react";

function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.91 2.722.91.817 0 2.15-.658 2.49-1.418.215-.473.215-.872.144-.96-.058-.157-.272-.244-.587-.4M12.062 21.585h-.015a9.55 9.55 0 0 1-4.872-1.335l-.348-.21-3.617.95.964-3.532-.227-.36a9.6 9.6 0 0 1-1.46-5.085c0-5.282 4.298-9.58 9.58-9.58a9.508 9.508 0 0 1 6.777 2.809 9.493 9.493 0 0 1 2.804 6.78c-.001 5.28-4.299 9.58-9.578 9.58"/>
      <path d="M20.52 3.452A11.86 11.86 0 0 0 12.05 0C5.495 0 .16 5.336.158 11.893a11.86 11.86 0 0 0 1.588 5.945L0 24l6.305-1.654a11.881 11.881 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.892-11.893A11.821 11.821 0 0 0 20.52 3.452"/>
    </svg>
  );
}

export function WhatsAppCheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("Full_Name") || "");
    const phone = String(fd.get("Phone") || "");

    try {
      // 1. إرسال الداتا لـ Formspree عشان تحفظ أرقام العملاء
      await fetch("https://formspree.io/f/mlgkzpkr", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Full_Name: fullName,
          Phone: phone,
          Action: "Initiated Checkout - Redirecting to WhatsApp",
        }),
      });

      // 2. تسجيل الحدث في فيسبوك بيكسل
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout", {
          value: 199.0,
          currency: "EGP",
          content_name: "بوصلة المستقل",
        });
      }

      // 3. تحويل العميل للواتساب
      const whatsappNumber = "201558856357";
      const message = encodeURIComponent("أهلاً، سجلت بياناتي ومهتم بكتيب بوصلة المستقل، إيه التفاصيل؟");
      window.open(
        `https://wa.me/${whatsappNumber}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err) {
      setErrorMsg("حدث خطأ في الاتصال، حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border-2 border-[#25D366]/30 bg-[#E8F8EF] p-8 sm:p-10 text-center shadow-elegant">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
        <WhatsAppIcon className="h-9 w-9" />
      </div>
      
      <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-navy">
        احجز نسختك الآن!
      </h3>
      <p className="mt-3 mb-6 text-base sm:text-lg text-navy/80 leading-relaxed">
        سجل بياناتك عشان نحفظ نسختك، وهيتم تحويلك للواتساب فوراً لإتمام الدفع واستلام الكتيب.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div>
          <input
            type="text"
            name="Full_Name"
            required
            placeholder="الاسم بالكامل"
            className="w-full rounded-xl border-2 border-white/60 bg-white p-4 outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/30 text-navy font-semibold"
          />
        </div>
        <div>
          <input
            type="tel"
            name="Phone"
            required
            dir="rtl"
            placeholder="رقم الواتساب (مثال: 01012345678)"
            className="w-full rounded-xl border-2 border-white/60 bg-white p-4 text-right outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/30 placeholder:text-right text-navy font-semibold"
          />
        </div>

        {errorMsg && (
          <p className="text-red-600 text-sm font-bold text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-5 text-lg sm:text-xl font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        >
          <WhatsAppIcon className="h-7 w-7" />
          {isLoading ? "جاري التحويل..." : "متابعة للواتساب ◀"}
        </button>
      </form>

      <p className="mt-5 text-xs font-semibold text-navy/60">
        معلوماتك في أمان تام، بنستخدمها فقط عشان نتابع معاك استلام الكتيب.
      </p>
    </div>
  );
}
