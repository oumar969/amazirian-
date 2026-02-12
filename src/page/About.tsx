import { Link } from "react-router-dom";
import { useT } from "../features/i18n/hooks/useT";

export default function About() {
    const { t, language } = useT();

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-500 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-400 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            {t("about.pill")}
                        </p>
                        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                            {t("about.title")}
                        </h1>
                        <p className="mt-4 text-lg leading-relaxed text-white/80">
                            {t("about.subtitle")}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
                            >
                                {t("about.cta.products")}
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-400"
                            >
                                {t("about.cta.login")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission / Values */}
            <section className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">
                        <h2 className="text-xl font-semibold text-slate-900">{t("about.missionTitle")}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">
                            {t("about.missionText")}
                        </p>
                        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">{t("about.focusNow")}</p>
                            <ul className="mt-2 grid gap-1 text-sm text-slate-700">
                                <li>• {t("about.focus.1")}</li>
                                <li>• {t("about.focus.2")}</li>
                                <li>• {t("about.focus.3")}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:col-span-2 md:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">{t("about.value.fastTitle")}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {t("about.value.fastText")}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">{t("about.value.scaleTitle")}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {t("about.value.scaleText")}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">{t("about.value.safeTitle")}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {t("about.value.safeText")}
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">{t("about.value.uiTitle")}</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {t("about.value.uiText")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats + RTL section */}
            <section className="mx-auto max-w-6xl px-6 pb-16">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">{t("about.status")}</h2>
                            <p className="mt-2 text-sm text-slate-600">{t("about.statusHint")}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 p-4 text-center">
                                <div className="text-2xl font-semibold text-slate-900">SPA</div>
                                <div className="mt-1 text-sm text-slate-600">React Router</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 text-center">
                                <div className="text-2xl font-semibold text-slate-900">Auth</div>
                                <div className="mt-1 text-sm text-slate-600">SQLite sessions</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 text-center">
                                <div className="text-2xl font-semibold text-slate-900">Katalog</div>
                                <div className="mt-1 text-sm text-slate-600">Søg + filtre</div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 text-center">
                                <div className="text-2xl font-semibold text-slate-900">UI</div>
                                <div className="mt-1 text-sm text-slate-600">Tailwind v4</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        {language === "ar" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">عن أمازيريان</h2>
                                <p className="mt-4 leading-loose text-slate-700">
                                    أمازيريان هي منصة تسوّق حديثة نطمح من خلالها إلى أن نصبح أكبر متجر إلكتروني في سوريا.
                                    نعمل على تقديم تجربة شراء بسيطة وسريعة: تصفّح ذكي للمنتجات، بحث وفلاتر دقيقة، وتفاصيل
                                    واضحة تساعدك على اتخاذ القرار بثقة.
                                </p>
                                <p className="mt-4 leading-loose text-slate-700">
                                    رؤيتنا هي بناء سوق يجمع بين الجودة والأسعار المناسبة وخدمة عملاء محترفة، مع تركيز كبير
                                    على الأمان والموثوقية. هدفنا أن يكون أمازيريان المكان الذي يبدأ منه الناس التسوّق — سواءً
                                    للإلكترونيات، الملابس، الكتب، أو احتياجات البيت.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">{t("about.next")}</p>
                        <div className="flex gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                            >
                                {t("about.goCatalog")}
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                            >
                                {t("nav.login")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}