import Image from "next/image";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-16",
  };

  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      <div
        className={clsx(
          sizeClasses[size],
          "flex items-center brightness-200 contrast-200 relative"
        )}
      >
        <Image
          src="/RecruitFlow.png"
          alt="RECRUITFLOW"
          width={160}
          height={64}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
