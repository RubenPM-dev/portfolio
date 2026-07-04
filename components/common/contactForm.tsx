import { getContact } from "@/lib/contentful/queries";
import { Reveal } from "../motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { fallbackContact } from "@/lib/site-config";

export default async function ContactForm({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const contact = await getContact(contentfulLocale[lang]);
  const mergedContact = contact?.fields || fallbackContact.fields;

  return (
    <section id="contact" className="section-gap hairline">
        <Reveal className="flex flex-col w-full justify-center items-center">
          <p className="kicker">{dict.sections.contactKicker}</p>
          <h2 className="section-heading mt-4 max-w-xl mx-auto">
            {mergedContact.heading}
          </h2>
          <p className="mt-6 max-w-md mx-auto text-base text-center leading-8 text-muted">
            {mergedContact.description}
          </p>
          <div className="mt-8 space-y-2 text-sm text-center text-muted">
            <p>
              <a
                href={`mailto:${mergedContact.email}`}
                className="focus-ring rounded-sm font-bold text-ink underline decoration-line underline-offset-4 transition-colors"
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
