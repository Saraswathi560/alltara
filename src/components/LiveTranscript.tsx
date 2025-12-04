import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TranscriptEntry } from "@/types/review";

interface LiveTranscriptProps {
  entries: TranscriptEntry[];
  className?: string;
}

export function LiveTranscript({ entries, className }: LiveTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const roleColors = {
    employee: "text-blue-600 dark:text-blue-400",
    manager: "text-purple-600 dark:text-purple-400",
    hr: "text-orange-600 dark:text-orange-400",
    assistant: "text-primary",
  };

  const roleBgColors = {
    employee: "bg-blue-50 dark:bg-blue-950",
    manager: "bg-purple-50 dark:bg-purple-950",
    hr: "bg-orange-50 dark:bg-orange-950",
    assistant: "bg-accent",
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Live Transcript</h3>
        <span className="text-xs text-muted-foreground">
          {entries.length} entries
        </span>
      </div>
      
      <ScrollArea className="flex-1 rounded-lg border bg-card" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Transcript will appear here once the session starts...
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "p-3 rounded-lg",
                  roleBgColors[entry.role],
                  !entry.isFinal && "opacity-70"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-sm font-medium", roleColors[entry.role])}>
                    {entry.role === "assistant" ? "TARA" : entry.speaker}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </span>
                  {!entry.isFinal && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      interim
                    </span>
                  )}
                </div>
                <p className="text-sm">{entry.text}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
