function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.91 2.722.91.817 0 2.15-.658 2.49-1.418.215-.473.215-.872.144-.96-.058-.157-.272-.244-.587-.4M12.062 21.585h-.015a9.55 9.55 0 0 1-4.872-1.335l-.348-.21-3.617.95.964-3.532-.227-.36a9.6 9.6 0 0 1-1.46-5.085c0-5.282 4.298-9.58 9.58-9.58a9.508 9.508 0 0 1 6.777 2.809 9.493 9.493 0 0 1 2.804 6.78c-.001 5.28-4.299 9.58-9.578 9.58"/>
      <path d="M20.52 3.452A11.86 11.86 0 0 0 12.05 0C5.495 0 .16 5.336.158 11.893a11.86 11.86 0 0 0 1.588 5.945L0 24l6.305-1.654a11.881 11.881 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.892-11.893A11.821 11.821 0 0 0 20.52 3.452"/>
    </svg>
  );
}

export function WhatsAppCheckoutButton() {
  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", {
        value: 199.0,
        currency: "EGP",
        content_name: "بوصلة المستقل",
      });
    }
    window.open(
      "https://wa.me/201558856357?text=أهلاً، أنا مهتم بكتيب بوصلة المستقل وعندي استفسار بسيط",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border-2 border-[#25D366]/30 bg-[#E8F8EF] p-8 sm:p-10 text-center shadow-elegant">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg">
        <WhatsAppIcon className="h-9 w-9" />
      </div>
      <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-navy">
        خطوة واحدة وتستلم نسختك!
      </h3>
      <p className="mt-3 text-base sm:text-lg text-navy/80 leading-relaxed">
        اضغط على الزرار، أكمل الشراء، واستلم الكتيب فوراً على الواتساب.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-5 text-lg sm:text-xl font-extrabold text-white shadow-xl transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
      >
        <WhatsAppIcon className="h-7 w-7" />
        إتمام الدفع عبر واتساب
      </button>
      <p className="mt-4 text-xs text-navy/60">
        بعد تأكيد الدفع، هيوصلك الكتيب التفاعلي فوراً على الواتساب.
      </p>
    </div>
  );
}
