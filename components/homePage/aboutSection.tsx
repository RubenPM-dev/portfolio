import { ParallaxImage } from "@/components/motion/parallaxImage";
import { Reveal } from "@/components/motion/reveal";
import { getAbout } from "@/lib/contentful/queries";
import { getImageUrl } from "@/lib/contentful/image";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackAbout } from "@/lib/siteConfig";

export default async function AboutSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const about = await getAbout(contentfulLocale[lang]);
  const mergedAbout = about?.fields || fallbackAbout.fields;

  return (
    <section id="about" className="section-gap hairline">
      <div className="grid-shell editorial-grid items-start">
        <Reveal className="col-span-12 lg:col-span-6">
          <p className="kicker">{dict.sections.aboutKicker}</p>
          <h2 className="section-heading mt-4 max-w-xl text-balance">{mergedAbout.heading}</h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">{mergedAbout.story}</p>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted">{mergedAbout.philosophy}</p>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 lg:col-span-6">
          {mergedAbout.portrait && getImageUrl(mergedAbout.portrait) ? (
            <ParallaxImage
              src={getImageUrl(mergedAbout.portrait)!}
              alt={mergedAbout.portrait.fields?.title || "Portrait"}
              width={880}
              height={1120}
              className="rounded-[var(--radius)] border border-line"
            />
          ) : (
            <div className="ambient-panel h-[34rem]" aria-hidden="true" />
          )}
          <ul className="mt-6 space-y-3">
            {(mergedAbout.journey || []).map((item: any) => (
              <li key={item.year || item} className="border-b border-line pb-3 text-sm leading-7 text-muted">
                {typeof item === "string" ? item : `${item.year}: ${item.event}`}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
