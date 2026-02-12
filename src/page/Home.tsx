import { Link } from "react-router-dom";
import { useT } from "../features/i18n/hooks/useT";

export default function Home() {
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
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t("home.badge")}
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("home.title")}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                {t("home.subtitle")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
                >
                  {t("home.cta.products")}
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-400"
                >
                  {t("home.cta.login")}
                </Link>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-white/10 p-4">
                  <dt className="text-sm text-white/70">{t("home.stat.speed")}</dt>
                  <dd className="mt-1 text-xl font-semibold">{t("home.stat.speedValue")}</dd>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <dt className="text-sm text-white/70">{t("home.stat.ui")}</dt>
                  <dd className="mt-1 text-xl font-semibold">{t("home.stat.uiValue")}</dd>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <dt className="text-sm text-white/70">{t("home.stat.login")}</dt>
                  <dd className="mt-1 text-xl font-semibold">{t("home.stat.loginValue")}</dd>
                </div>
              </dl>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/80">{t("home.featured")}</div>
                  <div className="text-xs text-white/60">{t("home.latest")}</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">{t("home.card.secureLogin")}</p>
                    <p className="mt-1 text-base font-semibold">{t("home.card.sessions")}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {t("home.card.sessionsText")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">{t("home.card.nav")}</p>
                    <p className="mt-1 text-base font-semibold">{t("home.card.protected")}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {t("home.card.protectedText")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">{t("home.card.arch")}</p>
                    <p className="mt-1 text-base font-semibold">{t("home.card.mvvm")}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {t("home.card.mvvmText")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-sm text-white/70">{t("home.card.deploy")}</p>
                    <p className="mt-1 text-base font-semibold">{t("home.card.gh")}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {t("home.card.ghText")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t("home.value.fastTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {t("home.value.fastText")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t("home.value.scaleTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {t("home.value.scaleText")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{t("home.value.dbTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {t("home.value.dbText")}
            </p>
          </div>
        </div>
      </section>

      {/* Arabic / RTL story */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {language === "ar" && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                مستقبل سوريا: نحو فجر جديد
              </h2>
              <p className="mt-4 leading-loose text-slate-700">
                في ظل التحديات الهائلة التي واجهها الشعب السوري خلال السنوات الماضية،
                يبرز الأمل اليوم في بناء مستقبل مشرق يليق بتاريخ سوريا العريق وشعبها
                الصامد.
              </p>
              <p className="mt-4 leading-loose text-slate-700">
                المستقبل يعتمد على المصالحة الوطنية، والتعليم، وتمكين الشباب لبناء دولة
                حديثة تحترم التنوع وتكفل الحقوق للجميع.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              {t("home.tip")}
            </p>
            <div className="flex gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                {t("products.title")}
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
