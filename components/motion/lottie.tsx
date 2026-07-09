"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false },
);

export function Lottie({
  src,
  className,
  loop = true,
  speed = 1,
  invertOnDark = false,
}: {
  src: string;
  className?: string;
  loop?: boolean;
  speed?: number;
  invertOnDark?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <DotLottieReact
      src={src}
      autoplay={!reduceMotion}
      loop={loop}
      speed={speed}
      className={cn(className, invertOnDark && "lottie-invert-dark")}
      aria-hidden="true"
    />
  );
}
