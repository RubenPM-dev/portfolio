import { cn } from "@/lib/utils";

export function StoreBadges({
  appStoreUrl,
  googlePlayUrl,
  className,
}: {
  appStoreUrl?: string;
  googlePlayUrl?: string;
  className?: string;
}) {
  if (!appStoreUrl && !googlePlayUrl) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {appStoreUrl ? (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Download on the App Store"
          className="focus-ring rounded-lg transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/badges/app-store.svg" alt="Download on the App Store" className="h-12 w-auto" />
        </a>
      ) : null}
      {googlePlayUrl ? (
        <a
          href={googlePlayUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Get it on Google Play"
          className="focus-ring rounded-lg transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/badges/google-play.svg" alt="Get it on Google Play" className="h-12 w-auto" />
        </a>
      ) : null}
    </div>
  );
}
