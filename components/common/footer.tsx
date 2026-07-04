import { getSettings } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { fallbackSettings } from "@/lib/site-config";

export default async function Footer({ id, lang }: { id?: string; lang: Locale }) {
  const settings = await getSettings(contentfulLocale[lang]);
  const settingsFields = settings?.fields || fallbackSettings.fields;

  return (
    <footer id={id} className="hairline mt-8">
      <div className="footer">
        <p>
          {settingsFields.siteTitle}
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
