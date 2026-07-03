import { getSettings } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { fallbackSettings } from "@/lib/site-config";

export default async function Footer({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const settings = await getSettings(contentfulLocale[lang]);
  const settingsFields = settings?.fields || fallbackSettings.fields;

  return (
    <footer className="hairline mt-8">
      <div className="grid-shell flex flex-col justify-between gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center">
        <p>
          {settingsFields.siteTitle} / {dict.footer.role}
        </p>
        <div className="flex gap-5">
          {(settingsFields.socialLinks || []).map((link: any) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-sm hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
