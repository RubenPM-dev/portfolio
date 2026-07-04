import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function IntroSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <section className="grid-shell flex min-h-[calc(100svh_-_var(--site-header-height,5rem))] flex-col justify-center py-10 lg:py-16">
        <Reveal className="flex-col justify-center">
          <p className="kicker mb-5">{dict.hero.kicker}</p>
          <h1 className="text-balance text-[clamp(2rem,6vw,4rem)] leading-[0.94]">
            {dict.hero.headline}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
            {dict.hero.subhead}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#work">{dict.hero.ctaWork}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#contact">{dict.hero.ctaContact}</a>
            </Button>
          </div>
        </Reveal>
    </section>
  );
}
