import { cn } from "@/lib/utils";
import { Bot, Sparkles } from "lucide-react";

interface AssistantPromptProps {
  prompt: string;
  className?: string;
}

export function AssistantPrompt({ prompt, className }: AssistantPromptProps) {
  return (
    <div className={cn(
      "bg-accent rounded-xl p-4 border border-primary/20",
      className
    )}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-primary">TARA</span>
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {prompt || "Listening..."}
          </p>
        </div>
      </div>
    </div>
  );
}
