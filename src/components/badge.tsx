import { POKEMON_TYPES, TYPE_COLORS } from "@/models/constants";
import { cn } from "@/lib/utils";
import { House, LucideIcon, Type } from "lucide-react";
import { Card, CardContent } from "./ui/card";

type TypeBadgeProps = {
  type: keyof typeof POKEMON_TYPES;
  size?: "small" | "medium" | "large";
};

type InformationBadgeProps = {
  title: string;
  label: string;
  icon: LucideIcon;
};

export function TypeBadge({ type, size = "medium" }: Readonly<TypeBadgeProps>) {
  return (
    <span
      className={cn("px-3 py-1 rounded-full text-sm font-semibold shadow-md", {
        "text-xs": size === "small",
        "text-lg": size === "large",
      })}
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {type}
    </span>
  );
}

export function InformationBadge({
  title,
  label,
  icon: Icon,
}: Readonly<InformationBadgeProps>) {
  return (
    <div className="space-y-2 text-center min-w-24 flex-1 max-w-32">
      <p className="flex items-center justify-center space-x-2">
        <Icon size={20} />
        <span className="text-lg font-medium">{label}</span>
      </p>
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
    </div>
  );
}
