import { getContact } from "@/lib/contentful/queries";
import { Reveal } from "../motion/reveal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { fallbackContact } from "@/lib/site-config";

export default async function ContactForm({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const contact = await getContact(contentfulLocale[lang]);
  const mergedContact = contact?.fields || fallbackContact.fields;

  return (
    <section id="contact" className="section-gap hairline">
      <div className="grid-shell editorial-grid">
        <Reveal className="col-span-12 lg:col-span-6">
          <p className="kicker">{dict.sections.contactKicker}</p>
          <h2 className="section-heading mt-4 max-w-xl">
            {mergedContact.heading}
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-muted">
            {mergedContact.description}
          </p>
          <div className="mt-8 space-y-2 text-sm text-muted">
            <p>{mergedContact.email}</p>
            <p>{mergedContact.location}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="col-span-12 lg:col-span-6">
          <form
            action={`mailto:${mergedContact.email}`}
            method="post"
            encType="text/plain"
            className="space-y-4 rounded-[var(--radius)] border border-line bg-surface p-7"
          >
            <label
              className="block text-sm font-medium text-ink"
              htmlFor="name"
            >
              {dict.contactForm.name}
            </label>
            <Input
              id="name"
              name="name"
              placeholder={dict.contactForm.namePlaceholder}
              required
            />
            <label
              className="block text-sm font-medium text-ink"
              htmlFor="email"
            >
              {dict.contactForm.email}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={dict.contactForm.emailPlaceholder}
              required
            />
            <label
              className="block text-sm font-medium text-ink"
              htmlFor="message"
            >
              {dict.contactForm.message}
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder={dict.contactForm.messagePlaceholder}
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              {dict.contactForm.submit}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
