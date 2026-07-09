import { Reveal } from "@/components/motion/reveal";
import { Lottie } from "@/components/motion/lottie";
import { Button } from "@/components/ui/button";
import { getKicker } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import ScrollIndicator from "../common/scrollIndicator";

export default async function IntroSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const kickerData = (await getKicker(contentfulLocale[lang]))?.fields;
  const kicker = kickerData?.kicker ?? dict.hero.kicker;
  const headline = kickerData?.headline ?? dict.hero.headline;
  const subhead = kickerData?.subhead ?? dict.hero.subhead;
  const ctaWork = kickerData?.ctaWork ?? dict.hero.ctaWork;
  const ctaContact = kickerData?.ctaContact ?? dict.hero.ctaContact;

  return (
    <section
      id="intro"
      className="relative grid-shell flex min-h-[calc(100svh_-_var(--site-header-height,5rem))] py-10 lg:py-16"
    >
      <Reveal className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-6 flex-col justify-center items-center">
          <p className="kicker mb-5">{kicker}</p>
          <h1 className="text-balance text-[clamp(2rem,6vw,4rem)] leading-[0.94]">
            {headline}
          </h1>
          <p className="mt-7 max-w-xl lg:max-w-3xl text-base text-center leading-8 text-muted md:text-xxl">
            {subhead}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8 max-sm:mt-16 max-sm:gap-4">
            <Button
              asChild
              trackId="hero_explore_work"
              aria-label="Explore selected work"
            >
              <a href="#work">{ctaWork}</a>
            </Button>
            <Button
              asChild
              variant="outline"
              trackId="hero_start_conversation"
              aria-label="Start a conversation"
            >
              <a href="#contact">{ctaContact}</a>
            </Button>
          </div>
        </div>

        <ScrollIndicator className="h-24 w-24 self-center max-sm:absolute max-sm:bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2" />
      </Reveal>
    </section>
  );
}
