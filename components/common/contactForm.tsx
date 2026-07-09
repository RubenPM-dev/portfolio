import { getContact } from "@/lib/contentful/queries";
import { Reveal } from "../motion/reveal";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { fallbackContact } from "@/lib/siteConfig";

export default async function ContactForm({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const contact = await getContact(contentfulLocale[lang]);
  const mergedContact = contact?.fields || fallbackContact.fields;

  return (
    <section
      id="contact"
      className="max-sm:py-[clamp(3rem,6vw,6rem)] sm:pt-[calc(var(--site-header-height,5rem)+6rem)] sm:pb-[calc(var(--site-header-height,5rem)+6rem)]"
    >
        <Reveal className="flex flex-col w-full justify-center items-center">
          <p className="kicker">{dict.sections.contactKicker}</p>
          <h2 className="section-heading mt-4 font-bold text-center text-ink text-balance" style={{ fontSize: "1.2rem" }}>
            {mergedContact.heading}
          </h2>
          <p className="mt-6 max-w-md mx-auto text-base text-justify px-3 leading-8 text-muted">
            {mergedContact.description}
          </p>
          <div className="mt-8 space-y-2 text-sm text-center text-muted">
            <p>
              <a
                href={`mailto:${mergedContact.email}`}
                className="focus-ring rounded-sm font-bold text-ink underline decoration-line transition-colors"
                style={{ textDecoration: "none", fontSize: "1.2rem" }}
              >
                {mergedContact.email}
              </a>
            </p>
            <p className="pt-8">{mergedContact.location}</p>
          </div>
        </Reveal>
    </section>
  );
}
