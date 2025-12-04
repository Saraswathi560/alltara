import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  features: string[];
  className?: string;
}

export function FeatureCard({ icon: Icon, title, features, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl p-6 shadow-card border border-border/50",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        {Icon && (
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        {features.join(" • ")}
      </p>
    </div>
  );
}
