import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "ready" | "connecting" | "active" | "error" | "offline";
  label?: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const statusConfig = {
    ready: {
      color: "bg-success",
      defaultLabel: "Voice assistant ready",
    },
    connecting: {
      color: "bg-warning animate-pulse-soft",
      defaultLabel: "Connecting...",
    },
    active: {
      color: "bg-success animate-pulse-soft",
      defaultLabel: "In session",
    },
    error: {
      color: "bg-destructive",
      defaultLabel: "Connection error",
    },
    offline: {
      color: "bg-muted-foreground",
      defaultLabel: "Offline",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <span className="text-sm text-muted-foreground">
        {label || config.defaultLabel}
      </span>
    </div>
  );
}
