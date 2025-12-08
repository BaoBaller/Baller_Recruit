import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import type { Hero } from "@shared/schema";

interface HeroSectionProps {
  hero: Hero | null;
  isLoading: boolean;
}

export function HeroSection({ hero, isLoading }: HeroSectionProps) {
  const { language, t } = useLanguage();

  const title = hero
    ? language === "vi"
      ? hero.titleVi
      : hero.titleEn
    : t.hero.defaultTitle;

  const subtitle = hero
    ? language === "vi"
      ? hero.subtitleVi
      : hero.subtitleEn
    : t.hero.defaultSubtitle;

  const ctaText = hero
    ? language === "vi"
      ? hero.ctaTextVi
      : hero.ctaTextEn
    : t.hero.defaultCta;

  const ctaLink = hero?.ctaLink || "#jobs";
  const backgroundImage = hero?.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80";
  const backgroundVideo = hero?.videoUrl;
  const isVideo = hero?.backgroundType === "video" && backgroundVideo;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      {isVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {isLoading ? (
            <div className="space-y-6">
              <div className="h-16 bg-white/20 rounded-lg animate-pulse mx-auto max-w-2xl" />
              <div className="h-8 bg-white/20 rounded-lg animate-pulse mx-auto max-w-xl" />
            </div>
          ) : (
            <>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                data-testid="text-hero-title"
              >
                {title}
              </h1>
              <p
                className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
                data-testid="text-hero-subtitle"
              >
                {subtitle}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="text-base px-8 py-6 rounded-full bg-primary text-primary-foreground border border-primary-border"
                  data-testid="button-hero-cta"
                >
                  <a href={ctaLink}>
                    {ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-8 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  data-testid="button-hero-watch"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {language === "vi" ? "Xem Video" : "Watch Video"}
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#jobs"
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">{language === "vi" ? "Cuộn xuống" : "Scroll down"}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5 rotate-90" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
