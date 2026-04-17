import Image from "next/image";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const dims: Record<NonNullable<Props["size"]>, { w: number; h: number }> = {
  sm: { w: 96, h: 60 },
  md: { w: 160, h: 100 },
  lg: { w: 280, h: 170 },
  xl: { w: 420, h: 260 },
};

export default function Logo({ size = "md", className = "" }: Props) {
  const { w, h } = dims[size];
  return (
    <Image
      src="/logo.svg"
      alt="Ready Golf Shop"
      width={w}
      height={h}
      priority
      className={className}
    />
  );
}
