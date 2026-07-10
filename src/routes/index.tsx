import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "بوصلة المستقل: دليلك في سوق الفريلانس" },
      { name: "description", content: "ورشة تفاعلية لاحتراف الفريلانس والحصول على أول عميل في 30 يوم." },
      { property: "og:title", content: "بوصلة المستقل" },
      { property: "og:description", content: "النظام التفاعلي للوصول لأول عميل خلال 30 يوم." },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "icon", type: "image/png", href: "public/faviconn.webp" } 
    ],
  }),
  component: LandingPage,
});

// TODO: Replace with your real keys
const IMGBB_API_KEY = "01f0bb8ab50d774b7dc1091f1c2840e8";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgkzpkr";

function trackPurchase() {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "Purchase", { value: 199.0, currency: "EGP" });
  }
}

function CheckIcon({ className = "h-6 w-6 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="h-6 w-6 shrink-0 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" /><path d="M12 17h.01" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}

function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const formElRef = useRef<HTMLFormElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [openChapter, setOpenChapter] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hasTrackedIC, setHasTrackedIC] = useState(false);

  // تتبع الـ Initiate Checkout الحقيقي فقط عند ملء الفورم
  const handleFormInteraction = () => {
    if (!hasTrackedIC) {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout", {
          value: 199.0,
          currency: "EGP",
          content_name: "بوصلة المستقل",
        });
      }
      setHasTrackedIC(true);
    }
  };

  const scrollToForm = () => {
    // تم إزالة التتبع الخاطئ من هنا!
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText("01020174981");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!file) {
      setErrorMsg("من فضلك ارفع صورة إيصال التحويل.");
      return;
    }

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const fullName = String(fd.get("Full_Name") || "");
    const phone = String(fd.get("Phone") || "");
    const email = String(fd.get("Email") || "");

    setIsLoading(true);

    try {
      // Step A: Upload image to ImgBB
      const imgForm = new FormData();
      imgForm.append("image", file);

      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: imgForm }
      );
      const imgJson = await imgRes.json();
      if (!imgRes.ok || !imgJson?.data?.url) {
        throw new Error("فشل رفع الصورة، حاول مرة أخرى.");
      }
      const receiptUrl: string = imgJson.data.url;

      // Step C: Send data to Formspree
      const fsRes = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Full_Name: fullName,
          Phone: phone,
          Email: email,
          Payment_Method: "VodafoneCash_InstaPay",
          Receipt_Image_URL: receiptUrl,
        }),
      });

      if (!fsRes.ok) {
        throw new Error("فشل إرسال البيانات، حاول مرة أخرى.");
      }

      trackPurchase();
      setSubmitted(true);
      setFile(null);
      formEl.reset();
    } catch (err: any) {
      setErrorMsg(err?.message || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING TOP RIBBON */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gold text-navy py-2 overflow-hidden" dir="ltr">
        <style>{`
          @keyframes infiniteScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .seamless-marquee {
            display: flex;
            width: max-content;
            animation: infiniteScroll 43s linear infinite;
          }
        `}</style>
        
        <div className="seamless-marquee">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="text-sm font-bold mx-8 whitespace-nowrap" dir="rtl">
              🔥 عرض لفترة محدودة! خصم خاص لأول 20 مشتري فقط.. لا تفوت الفرصة! 🔥
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="bg-navy text-navy-foreground relative overflow-hidden mt-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, oklch(0.74 0.13 80 / 0.35), transparent 50%), radial-gradient(circle at 10% 90%, oklch(0.62 0.12 175 / 0.25), transparent 50%)" }} />
        <div className="relative mx-auto max-w-5xl px-5 py-16 sm:py-24 text-center">
          <span className="inline-block rounded-full border border-gold/40 bg-white/5 px-4 py-2 text-xs sm:text-sm text-gold backdrop-blur">
            نفسك تزود دخلك من النت، بس حاسس إن معندكش مهارة تبيعها؟
          </span>
          <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-extrabold leading-[1.3]">
            اكتشف <span className="text-gold">"بوصلة المستقل"</span>..
            <br className="hidden sm:block" />
            النظام التفاعلي الوحيد اللي هياخدك من البداية لحد أول عميل في 30 يوم.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-navy-foreground/80 max-w-2xl mx-auto leading-relaxed">
            مش محتاج تكون مبرمج أو مصمم عشان تبدأ. النظام ده هيعلمك إزاي تخلي الذكاء الاصطناعي يكتشف مهارتك، ويحولها لمصدر دخل في 30 يوم.
          </p>
          <button onClick={scrollToForm} className="btn-gold mt-10 text-base sm:text-lg px-8 py-4">
            ابدأ رحلتك وهات أول عميل ◀
          </button>
        </div>
      </section>

      {/* AGITATION */}
      <section className="py-16 sm:py-24 px-5">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-4xl text-navy text-center leading-snug">
            عارف إحساس إنك تبعت 50 عرض (Proposal) ومحدش يرد عليك؟
          </h2>
          <ul className="mt-10 space-y-4">
            {[
              "بتبخس بسعرك عشان تنافس وبرضه مفيش شغل.",
              "خايف من حوار التسعير والعميل اللي بيفاصل.",
              "معندكش بورتفوليو ومش عارف تجيب عملاء من غيره.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-4 bg-card rounded-xl p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-border">
                <WarningIcon />
                <span className="text-base sm:text-lg leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHO IS THIS FOR (UPDATED PERSONAS) */}
      <section className="relative py-16 sm:py-24 px-5 bg-cream overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--navy) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl text-navy text-center leading-snug font-bold">
            النظام ده هيختصر عليك الطريق، بالذات لو أنت:
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                t: "بتدور على دخل إضافي بس معندكش وقت أو مهارة؟",
                d: "سواء كنت طالب أو موظف، النظام هيعلمك إزاي تستخدم الذكاء الاصطناعي كـ 'مهارة جاهزة' تقدم بيها خدمات وتجيب فلوس، من غير ما تضطر تذاكر وتدرس لشهور.",
              },
              {
                t: "زهقت من الكورسات النظرية وعايز 'تطبيق عملي'؟",
                d: "لو اتفرجت على فيديوهات كتير وحاسس إنك تايه، الكتيب ده مش مجرد معلومات تقرأها، ده كراسة عمل (Workbook) هتمشيك يوم بيوم بخطة واضحة لحد ما تمسك أول دولار.",
              },
              {
                t: "بدأت في الفريلانس بس مش عارف تجيب عملاء؟",
                d: "لو عملت حسابات على مواقع العمل الحر ومفيش شغل بيجيلك، هتاخد هنا استراتيجيات 'صيد العملاء' وقوالب (Prompts) جاهزة تقنع بيها أي عميل يشتغل معاك.",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="bg-card rounded-2xl p-7 border border-border shadow-card flex flex-col items-start gap-4 hover:-translate-y-1 hover:shadow-elegant transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0">
                  <CheckIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl text-navy font-bold">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="bg-navy text-navy-foreground py-16 sm:py-24 px-5">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold">
              بوصلة المستقل هو <span className="text-gold">دليلك العملي.</span>
            </h2>
            <p className="mt-5 text-lg text-navy-foreground/85 leading-relaxed">
              إحنا مش بنديك نظريات، إحنا بنديك "ترسانة أسلحة" كاملة.
            </p>
            <p className="mt-6 text-xl sm:text-2xl font-bold text-gold leading-snug">
              أول كتيب تفاعلي في الوطن العربي.. اصنع خطتك بنفسك!
            </p>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <img 
              src="/coverr.webp" 
              alt="موك أب كتيب بوصلة المستقل" 
              className="w-full max-w-md h-auto object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* FEATURES (6 cards) */}
      <section className="py-16 sm:py-24 px-5">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl sm:text-4xl text-navy">إيه اللي جوه الكتيب؟</h2>
          <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
            نبذة من الفصول الي بداخل الكتيب
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { e: "🎯", t: "اكتشاف مهارتك بالذكاء الاصطناعي", d: "حتى لو بتبدأ من الصفر، هعلمك إزاي تستخدم الـ AI عشان تلاقي مجال مطلوب في السوق وتقدر تقدم فيه خدمة قوية وتكسب منها." },
              { e: "💰", t: "التسعير الذكي والباكدجات", d: "إزاي تسعر مجهودك وتعمل 3 باكدجات لخدمتك عشان تمنع فصال العميل وتكسب أكتر." },
              { e: "🎣", t: "خطة \"صيد\" العملاء", d: "بلاش تستنى الرزق.. خطة عملية بـ 'قاعدة الـ 10 في اليوم' لجلب العملاء من بوق الأسد." },
              { e: "🤖", t: "ترسانة الـ Master Prompts", d: "قوالب ذكاء اصطناعي جاهزة للنسخ تشتغل كفريق مساعدينك: محلل، بياع، ومراجع جودة." },
              { e: "🛡️", t: "فن التعامل مع الاعتراضات", d: "ردود ذكية ومجربة للرد على \"سعرك غالي\" و \"هفكر وأرد عليك\" وتقفيل الديل." },
              { e: "📅", t: "خطة الـ 30 يوم التنفيذية", d: "كراسة عمل تفاعلية يوم بيوم تاخدك من البداية لحد استلام أول شيك." },
            ].map((c) => (
              <div
                key={c.t}
                className="bg-card rounded-2xl p-7 border border-border shadow-card hover:-translate-y-1 hover:shadow-elegant transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-3xl">
                  <span aria-hidden>{c.e}</span>
                </div>
                <h3 className="mt-5 text-lg sm:text-xl text-navy leading-snug">{c.t}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM ACCORDION */}
      <section className="py-16 sm:py-24 px-5 bg-cream">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl sm:text-4xl text-navy text-center leading-snug">
            نظرة من الداخل: إيه اللي هتتعلمه في الكتيب؟
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            17 فصل عملي مقسمين على 4 مراحل متكاملة.
          </p>
          <div className="mt-10 space-y-3">
            {[
              {
                t: "المرحلة الأولى: التأسيس واكتشاف المهارة",
                items: [
                  "الفصل الأول: مقدمة واقعية (نقطة البداية الحقيقية — بدون وعود وهمية)",
                  "الفصل الثاني: يعني إيه شغل أونلاين بالـ AI؟ (ميكانيكا العمل الحر واقتصاديات الإنتاجية المضاعفة ×10)",
                  "الفصل الثالث: فهم السوق المصري والعربي (تحليل علمي ونفسي للعميل اللي هيدفعلك)",
                  "الفصل الرابع: اختيار الخدمة المناسبة (هندسة التخصص: إزاي تلاقي مجالك بناءً على بيانات السوق؟)",
                ],
              },
              {
                t: "المرحلة الثانية: تجهيز الأسلحة والمحل الديجيتال",
                items: [
                  "الفصل الخامس: أدواتك الأساسية (بناء \"البنية التحتية الرقمية\" لشغلك — ترسانة مش للعب)",
                  "الفصل السادس: كيف تكتب Prompt احترافي؟ (هندسة الأوامر: برمجة العقول الآلية بلغة البزنس)",
                  "الفصل السابع: تحويل المهارة لخدمة بتتباع (من مهارة خام لـ \"باكدج\" بتجيب فلوس)",
                  "الفصل الثامن: بناء بورتفوليو بدون عملاء (إزاي تقنع العميل بشغل لسه ما عملتوش؟)",
                  "الفصل التاسع: التسعير الواقعي للمبتدئين (إزاي تسعر مجهودك من غير ما تظلم نفسك أو تطفش العميل؟)",
                  "الفصل العاشر: تجهيز بروفايل LinkedIn ومواقع العمل الحر (واجهة \"محلك الديجيتال\" اللي بتجيب عملاء)",
                ],
              },
              {
                t: "المرحلة الثالثة: رحلة الصيد وإغلاق الديل",
                items: [
                  "الفصل الحادي عشر: البحث عن أول عميل (خطة الصيد — مش هتستنى، هتروح تجيبه)",
                  "الفصل الثاني عشر: رسائل التواصل والبيع (إزاي تفتح كلام وتقفل الديل؟)",
                  "الفصل الثالث عشر: التعامل مع اعتراضات العملاء (إزاي ترد بذكاء وما تخسرش الديل؟)",
                  "الفصل الرابع عشر: خطة الـ 30 يوم (كراسة العمل التنفيذية يوم بيوم)",
                ],
              },
              {
                t: "المرحلة الرابعة: الاحتراف وحماية البيزنس",
                items: [
                  "الفصل الخامس عشر: ترسانة الأسلحة Master Prompts (فريق المساعدين بتاعك: محلل، مدير مشاريع، بياع، ومراجع جودة)",
                  "الفصل السادس عشر: حماية أكل عيشك (الرادار الديجيتال للحماية من النصب وأخطاء الـ AI)",
                  "الفصل السابع عشر: ما بعد أول عميل (إزاي تحول العميل الواحد لإمبراطورية؟)",
                ],
              },
            ].map((stage, i) => {
              const open = openChapter === i;
              return (
                <div key={stage.t} className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                  <button
                    type="button"
                    onClick={() => setOpenChapter(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right"
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-full bg-gold/15 text-gold font-extrabold flex items-center justify-center text-sm shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-bold text-navy text-base sm:text-lg">{stage.t}</span>
                    </span>
                    <span className={`text-gold text-2xl transition-transform shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                        {stage.items.map((it) => (
                          <li key={it} className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                            <CheckIcon className="h-5 w-5 text-teal mt-1" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 px-5 bg-cream">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl text-navy text-center leading-snug">
            قصص نجاح من ناس بدأوا زيك بالظبط..
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                text: "كنت تايه ومش عارف ابدأ منين وكل ما اتعلم حاجة احس اني مش جاهز. الكتيب ده حرفياً حطني على أول الطريق، ميزة خطة الـ 30 يوم إنها بتجبرك تشتغل. جبت أول عميل من لينكد إن في أقل من 3 أسابيع!",
                name: "أحمد محمود",
                role: "مصمم جرافيك مبتدئ",
              },
              {
                text: "ميزة الكتيب ده مش بس إنه بيعلمك فريلانس، ده بيديك 'برومبتس' جاهزة بتنجز شغل أسابيع في أيام. فصل التسعير والرد على اعتراضات العملاء خلاني أزود سعري الضعف وأنا واثق من نفسي.",
                name: "سارة كمال",
                role: "كاتبة محتوى",
              },
              {
                text: "أنا مكنش عندي مهارة واضحة أصلاً! استخدمت الذكاء الاصطناعي زي ما الكتيب شرح عشان ألاقي تخصص مطلوب. دلوقتي بقدم خدمة تحسين صفحات الهبوط ومبسوط جداً بالسيستم اللي بنيته بفضل الكتيب.",
                name: "مصطفى طارق",
                role: "مستقل",
              },
            ].map((r) => (
              <figure
                key={r.name}
                className="bg-card rounded-2xl p-7 border border-border shadow-card flex flex-col gap-4 relative"
              >
                <svg className="h-9 w-9 text-teal" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A1.67 1.67 0 0 1 17.17 9.5V6Z" />
                </svg>
                <div className="flex gap-1 text-gold text-lg" aria-label="5 stars">
                  {"★★★★★"}
                </div>
                <blockquote className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {r.text}
                </blockquote>
                <figcaption className="mt-2 pt-4 border-t border-border">
                  <div className="font-bold text-navy">{r.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE / FINAL CTA */}
      <section className="px-5 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl bg-card rounded-3xl border border-border shadow-card p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl text-navy leading-snug">
            سعر النظام ده أقل من تمن خروجة.. بس ممكن يغير مسار حياتك المهنية.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
            لو اشتركت في كورس فريلانس هتدفع على الأقل 100 دولار، ولو جربت مع نفسك هتخسر شهور من التخبط.
            بوصلة المستقل بيديك الخلاصة والتطبيق العملي.
          </p>
          <div className="mt-8 flex items-end justify-center gap-4 flex-wrap">
            <span className="text-3xl text-muted-foreground line-through decoration-destructive decoration-2">1199ج</span>
            <span className="text-6xl sm:text-7xl font-extrabold text-gold leading-none">199ج</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-navy">احصل عليه اليوم بـ 199ج فقط</p>
          <button onClick={scrollToForm} className="btn-gold mt-8 text-lg px-10 py-5">
            احجز نسختك الآن ◀
          </button>
          <p className="mt-4 text-sm text-muted-foreground">
            بمجرد تأكيد الدفع، سيصلك النظام التفاعلي فوراً علي الواتساب لتبدأ رحلتك.
          </p>
        </div>
      </section>
      
      {/* CHECKOUT - THE ORIGINAL FORM WITH BONUS & GUARANTEE */}
      <section ref={formRef} className="bg-navy/5 py-16 sm:py-24 px-5" id="checkout">
        <div className="mx-auto max-w-2xl">
          <div className="bg-card rounded-3xl shadow-elegant border border-border p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl text-navy text-center font-bold">
              أتمم عملية الشراء واستلم نسختك فوراً
            </h2>
            
            <p className="mt-2 text-center text-sm font-bold text-gold">🎁 خصم خاص لأول 20 عميل</p>
            <div className="mt-3 mb-8 rounded-xl border-2 border-gold/60 bg-gold/10 px-5 py-3 text-center">
              <span className="text-sm sm:text-base font-extrabold text-navy">
                ⏳ باقي علي الخصم: {Math.floor(Math.random() * 20) + 1} عميل، الحق نسختك دلوقتي!
              </span>
            </div>

            {/* --- NEW: VALUE STACKING (BONUSES) --- */}
            <div className="bg-gold/10 border border-gold rounded-2xl p-6 mb-8 text-right">
              <h4 className="text-lg sm:text-xl font-extrabold text-navy mb-4">🎁 احجز اليوم واحصل على 3 هدايا مجانية:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckIcon className="text-teal w-6 h-6 shrink-0" />
                  <span className="text-navy font-semibold text-sm sm:text-base">ملف إكسيل جاهز لتسعير خدماتك باحترافية (قيمته 15$).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="text-teal w-6 h-6 shrink-0" />
                  <span className="text-navy font-semibold text-sm sm:text-base">مكتبة الـ Master Prompts: +50 أمر جاهز للنسخ (قيمته 25$).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="text-teal w-6 h-6 shrink-0" />
                  <span className="text-navy font-semibold text-sm sm:text-base">دعم فني واستشارات على الواتساب لضمان نجاحك.</span>
                </li>
              </ul>
            </div>

            {/* --- NEW: RISK REVERSAL (GUARANTEE) --- */}
            <div className="bg-teal/10 border border-teal rounded-2xl p-6 mb-8 text-center flex flex-col items-center">
              <span className="text-4xl mb-3">🛡️</span>
              <h4 className="text-lg sm:text-xl font-extrabold text-navy">ضمان استرداد الأموال 100%</h4>
              <p className="text-sm text-navy/80 mt-2 font-medium leading-relaxed">
                لو طبقت خطة الـ 30 يوم خطوة بخطوة ومقدرتش تجيب أول عميل ليك، راسلنا وهنردلك مبلغ الـ 199 جنيه بالكامل بدون أي أسئلة. (مخاطرتك 0%).
              </p>
            </div>

            {/* Payment instructions */}
            <div className="mt-8 rounded-2xl border-2 border-gold bg-gold/5 p-6">
              <p className="text-sm sm:text-base font-bold text-navy text-center leading-relaxed">
                طريقة الدفع الوحيدة حالياً: قم بتحويل <span className="text-gold">199ج</span> إلى فودافون كاش / انستا باي على الرقم:
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap" dir="ltr">
                <span className="text-3xl sm:text-4xl font-extrabold text-navy tracking-wider select-all bg-cream px-4 py-2 rounded-lg border border-gold/40">
                  01020174981
                </span>
                <button
                  type="button"
                  onClick={copyNumber}
                  className="text-xs font-bold rounded-md bg-navy text-navy-foreground px-4 py-3 hover:opacity-90"
                >
                  {copied ? "تم النسخ ✓" : "نسخ الرقم"}
                </button>
              </div>
            </div>

            {submitted ? (
              <div id="success" className="mt-8 rounded-2xl border-2 border-teal bg-teal/10 p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-teal text-white flex items-center justify-center">
                  <CheckIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl text-navy font-bold">تم استلام طلبك بنجاح! 🎉</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  هنتأكد من التحويل، وهيوصلك النظام التفاعلي على الإيميل والواتساب خلال لحظات.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-bold text-gold hover:underline"
                >
                  إرسال طلب آخر
                </button>
              </div>
            ) : (
              <>
              <form
                ref={formElRef}
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate={false}
              >
                <Field 
                  label="الاسم" 
                  name="Full_Name" 
                  type="text" 
                  placeholder="اكتب اسمك بالكامل" 
                  required 
                  onFocus={handleFormInteraction}
                />
                <Field 
                  label="رقم الموبايل" 
                  name="Phone" 
                  type="tel" 
                  placeholder="01xxxxxxxxx (هتتبعتلك عليه نسختك)" 
                  pattern="[0-9+\s\-]{8,15}" 
                  required 
                  onFocus={handleFormInteraction}
                />
                <Field 
                  label="الايميل" 
                  name="Email" 
                  type="email" 
                  placeholder="you@email.com" 
                  required 
                  onFocus={handleFormInteraction}
                />

                <div>
                  <label className="block text-sm font-bold mb-2 text-navy">طريقة الدفع</label>
                  <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gold bg-gold/10 cursor-not-allowed">
                    <input type="radio" name="Payment_Method" value="VodafoneCash_InstaPay" checked readOnly className="accent-gold h-5 w-5" />
                    <span className="font-bold text-navy">فودافون كاش / انستا باي</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-navy">
                    ارفع صورة (سكرين شوت) تؤكد إتمام التحويل
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-gold/60 bg-gold/5 cursor-pointer hover:bg-gold/10 transition">
                    <svg className="h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <span className="text-sm font-semibold text-navy">
                      {file?.name || "اضغط لاختيار الصورة"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      className="sr-only"
                      onChange={(e) => {
                        handleFormInteraction();
                        setFile(e.target.files?.[0] || null);
                      }}
                    />
                  </label>
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive font-semibold text-center">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gold w-full text-lg py-5"
                >
                  {isLoading ? "جاري رفع الصورة وتأكيد الدفع..." : "تأكيد الدفع ◀"}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  خلال لحظات هيتم التأكد من التحويل، وهيتبعتلك النظام على الايميل والواتساب.
                </p>
              </form>
              <WhatsAppFallbackButton />
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 px-5">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl text-navy text-center">الأسئلة الشائعة</h2>
          <div className="mt-10 space-y-3">
            {[
              { q: "هل النظام ده ينفع لمجالي؟", a: "أيوة، لأنه بيعلمك سيستم البيع والتسعير لأي مهارة." },
              { q: "إزاي هستلم الكتيب؟", a: "هيوصلك رابط الدخول والكود الخاص بيك فوراً بعد التأكد من الدفع." },
              { q: "هل محتاج أكون عندي مهارة أو خبرة سابقة عشان أبدأ؟", a: "مش محتاج، لأن الكتيب هيعلمك إزاي تخلي الذكاء الاصطناعي يكتشف مهارتك ويحولها لمصدر دخل" },
              { q: "هل ده مجرد كتاب PDF عادي هقرأه وأنساه؟", a: "لا دي سيستم كامل بيتفاعل معاك وبيعرفك كل حاجة وبيطلعلك خطة خاصة بيك" },
            ].map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right"
                  >
                    <span className="font-bold text-navy text-base sm:text-lg">{item.q}</span>
                    <span className={`text-gold text-2xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{item.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy text-navy-foreground/70 py-8 text-center text-sm px-5">
        © 2026 بوصلة المستقل. جميع الحقوق محفوظة.
      </footer>

      {/* FLOATING BOTTOM CTA */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <button
          onClick={scrollToForm}
          className="pointer-events-auto bg-teal text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
          style={{ animation: "subtle-bounce 2.5s ease-in-out infinite" }}
        >
          احجز نسختك الآن ◀
        </button>
      </div>
    </>
  );
}

function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.4134-.074-.111-.272-.173-.57-.322zM12.005 2.001c-6.077 0-11.002 4.925-11.002 11.002 0 1.94.505 3.84 1.466 5.512L.758 22.209l3.8-1.003A10.946 10.946 0 0012.005 24c6.077 0 11.002-4.925 11.002-11.002 0-2.937-1.146-5.702-3.228-7.785A10.947 10.947 0 0012.005 2.001z" />
    </svg>
  );
}

function WhatsAppFallbackButton() {
  return (
    <a
      href="https://wa.me/201558856357?text=أهلاً، أواجه مشكلة في إتمام الدفع أو رفع الصورة لكتيب بوصلة المستقل، وهذا إثبات الدفع:"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 block w-full rounded-2xl bg-[#25D366] px-5 py-4 text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
    >
      <div className="flex items-center justify-center gap-3">
        <WhatsAppIcon className="h-7 w-7 shrink-0" />
        <div className="text-right leading-snug">
          <p className="text-sm font-bold sm:text-base">
            واجهت مشكلة في الدفع أو رفع الصورة؟
          </p>
          <p className="text-xs font-semibold opacity-95 sm:text-sm">
            أرسل إثبات الدفع عبر واتساب من هنا
          </p>
        </div>
      </div>
    </a>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
  pattern,
  onFocus,
}: {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  onFocus?: () => void;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-bold mb-2 text-navy">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        onFocus={onFocus}
        className="w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
      />
    </div>
  );
}
