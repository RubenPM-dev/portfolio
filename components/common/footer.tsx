import { getSettings } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackSettings } from "@/lib/siteConfig";

export default async function Footer({ id, lang }: { id?: string; lang: Locale }) {
  const settings = await getSettings(contentfulLocale[lang]);
  const settingsFields = settings?.fields || fallbackSettings.fields;
  const dict = getDictionary(lang);

  return (
    <footer id={id} className="hairline mt-8">
      <div className="footer">
        <p>
          {settingsFields.siteTitle}
        </p>
        <div className="flex gap-5">
          {(settingsFields.socialLinks || []).map((link: { url: string; label: string }) => (
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
          <button
            type="button"
            data-cc="show-preferencesModal"
            className="focus-ring rounded-sm text-left hover:text-ink"
          >
            {dict.cookies.settings}
          </button>
        </div>
      </div>
    </footer>
  );
}
