import { cn } from "@/lib/utils";

interface TaraLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TaraLogo({ size = "md", className }: TaraLogoProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-card shadow-card flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          size === "sm" ? "w-10 h-10" : size === "md" ? "w-16 h-16" : "w-20 h-20"
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central hub */}
        <circle cx="50" cy="50" r="8" className="fill-primary" />
        
        {/* Outer nodes */}
        <circle cx="50" cy="20" r="6" className="fill-primary" />
        <circle cx="76" cy="35" r="6" className="fill-primary" />
        <circle cx="76" cy="65" r="6" className="fill-primary" />
        <circle cx="50" cy="80" r="6" className="fill-primary" />
        <circle cx="24" cy="65" r="6" className="fill-primary" />
        <circle cx="24" cy="35" r="6" className="fill-primary" />
        
        {/* Connecting lines */}
        <line x1="50" y1="42" x2="50" y2="26" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line x1="56" y1="45" x2="70" y2="38" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line x1="56" y1="55" x2="70" y2="62" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line x1="50" y1="58" x2="50" y2="74" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line x1="44" y1="55" x2="30" y2="62" stroke="hsl(var(--primary))" strokeWidth="2" />
        <line x1="44" y1="45" x2="30" y2="38" stroke="hsl(var(--primary))" strokeWidth="2" />
        
        {/* Inner decorative ring */}
        <circle cx="50" cy="50" r="16" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      </svg>
    </div>
  );
}
