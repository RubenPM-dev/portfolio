import { Lottie } from "../motion/lottie";

export default function ScrollIndicator({
  className = "flex w-20 h-20 justify-self-end",
}: {
  className?: string;
}) {
  return (
    <Lottie
      src="https://lottie.host/80a7c64e-595a-4f7e-aca4-e28ce66fcce3/6d8zOHE1Cf.lottie"
      speed={0.6}
      invertOnDark
      className={className}
    />
  );
}
