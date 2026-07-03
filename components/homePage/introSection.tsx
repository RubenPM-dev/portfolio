import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default function IntroSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);

  return (
    <section className="grid-shell flex min-h-[78svh] flex-col justify-center py-10 lg:py-16">
      <div className="editorial-grid items-end">
        <Reveal className="col-span-12 lg:col-span-7">
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

        <Reveal delay={0.15} className="col-span-12 lg:col-span-4">
          <div className="ambient-panel relative h-[28rem] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,#d8d3c4_0,#f6f1e4_42%,#eee7d7_100%)]" />
            <div className="absolute inset-x-7 top-14 border-t border-black/20" />
            <div className="absolute inset-x-7 bottom-9 border-t border-black/20" />
            <p className="absolute left-7 top-7 z-10 text-xs uppercase tracking-[0.12em] text-black/65">
              {dict.hero.panelLocation}
            </p>
            <p className="absolute left-7 bottom-7 max-w-[15rem] text-sm leading-7 text-black/70">
              {dict.hero.panelNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
