import Image from "next/image";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  className?: string;
};

const dims: Record<NonNullable<Props["size"]>, { w: number; h: number }> = {
  sm: { w: 96, h: 60 },
  md: { w: 160, h: 100 },
  lg: { w: 280, h: 170 },
  xl: { w: 420, h: 260 },
};

export default function Logo({
  size = "md",
  variant = "dark",
  className = "",
}: Props) {
  const { w, h } = dims[size];
  const src = variant === "light" ? "/logo.svg" : "/logo-dark.svg";
  return (
    <Image
      src={src}
      alt="Ready Golf Shop"
      width={w}
      height={h}
      priority
      className={className}
    />
  );
}
