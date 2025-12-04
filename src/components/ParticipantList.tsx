import { cn } from "@/lib/utils";
import { Mic, MicOff, Wifi, WifiOff, User } from "lucide-react";
import type { Participant } from "@/types/review";

interface ParticipantListProps {
  participants: Participant[];
  className?: string;
}

export function ParticipantList({ participants, className }: ParticipantListProps) {
  const roleLabels = {
    employee: "Employee",
    manager: "Manager",
    hr: "HR",
  };

  const statusConfig = {
    pending: { icon: WifiOff, label: "Pending", color: "text-muted-foreground" },
    connected: { icon: Wifi, label: "Connected", color: "text-success" },
    disconnected: { icon: WifiOff, label: "Disconnected", color: "text-destructive" },
    muted: { icon: MicOff, label: "Muted", color: "text-warning" },
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Participants</h3>
      
      {participants.map((participant) => {
        const status = statusConfig[participant.status];
        
        return (
          <div
            key={participant.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg bg-card border",
              participant.isSpeaking && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              participant.isSpeaking ? "bg-primary text-primary-foreground" : "bg-secondary"
            )}>
              <User className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{participant.name}</p>
              <p className="text-sm text-muted-foreground">
                {roleLabels[participant.role]}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {participant.isSpeaking && (
                <span className="flex items-center gap-1 text-xs text-primary font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Speaking
                </span>
              )}
              
              <div className={cn("flex items-center gap-1", status.color)}>
                <status.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
