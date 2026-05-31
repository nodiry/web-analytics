import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, BarChart3, Zap, Shield, Globe } from "lucide-react";
import LangOption from "./components/LangOption";
import FAQ from "./faq";
import HowItWorks from "./components/HowItWorks";
import { ModeToggle } from "./components/mode-toggle";
import { useTranslation } from "./i18n";

const techLogos = [
  "/react.svg",
  "/vite.png",
  "/bun.webp",
  "/jwt.png",
  "/tailwind.svg",
  "/shadcn.webp",
  "/framer.png",
  "/typescript.svg",
  "/mongo.webp",
  "/express.svg",
  "/resend.webp",
];

const TechMarquee = ({ logos }: { logos: string[] }) => (
  <div className="relative overflow-hidden w-full py-4">
    <div className="marquee">
      <div className="marquee-inner">
        {[...logos, ...logos].map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt=""
            className="h-7 mx-4 md:h-10 opacity-60 hover:opacity-100 transition-opacity"
          />
        ))}
      </div>
    </div>
  </div>
);

export default function HeroPage() {
  const { t } = useTranslation();
  const controls = useAnimation();
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) controls.start({ y: -80, opacity: 0 });
      else controls.start({ y: 0, opacity: 1 });
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, controls]);

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: t("feat1_title"),
      desc: t("feat1_desc"),
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: t("feat2_title"),
      desc: t("feat2_desc"),
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: t("feat3_title"),
      desc: t("feat3_desc"),
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: t("feat4_title"),
      desc: t("feat4_desc"),
    },
  ];

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-background text-foreground">
      {/* Navbar */}
      <motion.nav
        animate={controls}
        initial={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 backdrop-blur-xl bg-background/70 border-b border-border/40"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">
            Glasscube Analytics
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HowItWorks />
          <LangOption />
          <ModeToggle />
          <Link to="/auth/signin">
            <Button variant="ghost" size="sm">
              {t("signin")}
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button size="sm">{t("cta_start")}</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6"
        >
          <Zap className="h-3.5 w-3.5" /> {t("hero_badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          {t("hero_title1")}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400">
            {t("hero_title2")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl"
        >
          {t("hero_subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          <Button size="lg" asChild>
            <Link to="/auth/signup">{t("cta_start")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/nodiry/analytics-client"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" /> {t("cta_source")}
            </a>
          </Button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className="relative mt-16 w-full max-w-3xl"
        >
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-border/50 overflow-hidden shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/50 border-b border-border/50">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <div className="ml-4 flex-1 h-5 bg-muted rounded text-xs flex items-center justify-center text-muted-foreground">
                analytics.glasscube.io/dashboard
              </div>
            </div>
            <img
              src="/dashboard.webp"
              alt="Dashboard preview"
              className="w-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          {t("features_section")}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-xl border border-border/50 bg-card hover:border-primary/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack marquee */}
      <section className="w-full py-8 border-y border-border/40">
        <p className="text-center text-xs text-muted-foreground mb-4 font-medium tracking-widest uppercase">
          {t("powered_by")}
        </p>
        <TechMarquee logos={techLogos} />
      </section>

      {/* FAQ */}
      <section className="w-full max-w-3xl mx-auto px-6 py-20">
        <FAQ />
      </section>

      {/* CTA */}
      <section className="w-full max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-10"
        >
          <h2 className="text-3xl font-bold mb-3">{t("cta_ready_title")}</h2>
          <p className="text-muted-foreground mb-6">{t("cta_ready_sub")}</p>
          <Button size="lg" asChild>
            <Link to="/auth/signup">{t("cta_free")}</Link>
          </Button>
        </motion.div>
      </section>

      <footer className="pb-8 text-muted-foreground text-xs text-center">
        © {new Date().getFullYear()} Glasscube Analytics. All rights reserved.
      </footer>
    </div>
  );
}
