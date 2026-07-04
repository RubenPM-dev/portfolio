import { Reveal } from "@/components/motion/reveal";
import { Lottie } from "@/components/motion/lottie";
import { Button } from "@/components/ui/button";
import { getKicker } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
    <section className="relative grid-shell flex min-h-[calc(100svh_-_var(--site-header-height,5rem))] py-10 lg:py-16">
      <Reveal className="flex flex-col w-full justify-center items-center">
        <div className="flex flex-6 flex-col justify-center items-center">
          <p className="kicker mb-5">{kicker}</p>
          <h1 className="text-balance text-[clamp(2rem,6vw,4rem)] leading-[0.94]">
            {headline}
          </h1>
          <p className="mt-7 max-w-xl text-base text-center leading-8 text-muted sm:text-lg">
            {subhead}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8 max-sm:mt-16 max-sm:gap-4">
            <Button asChild>
              <a href="#work">{ctaWork}</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#contact">{ctaContact}</a>
            </Button>
          </div>
        </div>

        {/* <Lottie
          src="https://lottie.host/80340bbf-fe59-466a-950b-e235567b1cd3/QgIagDGDA3.lottie"
          speed={0.1}
          className="flex-1 w-full aspect-auto self-center justify-self-center lg:max-w-lg"
        /> */}
        {/* Mobile: pinned near the bottom edge of the fold as a scroll cue.
            Desktop: sits centered in the hero column flow. */}
        <ScrollIndicator className="h-24 w-24 self-center max-sm:absolute max-sm:bottom-6 max-sm:left-1/2 max-sm:-translate-x-1/2" />
      </Reveal>
    </section>
  );
}
