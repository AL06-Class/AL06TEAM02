import { User } from "lucide-react";
import { cn } from "./utils";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-line bg-page text-muted",
        "items-center justify-center",
        sizeClass[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <User aria-hidden className="h-1/2 w-1/2" />
      )}
    </span>
  );
}

