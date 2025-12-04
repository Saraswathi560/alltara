import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  PhoneOff,
  Hand,
  Circle,
  Square,
  Camera,
} from "lucide-react";

interface MeetingControlsProps {
  isRecording: boolean;
  isMuted: boolean;
  isHandRaised: boolean;
  canRecord: boolean;
  onToggleMute: () => void;
  onToggleRecord: () => void;
  onRaiseHand: () => void;
  onSnapshot: () => void;
  onLeave: () => void;
  className?: string;
}

export function MeetingControls({
  isRecording,
  isMuted,
  isHandRaised,
  canRecord,
  onToggleMute,
  onToggleRecord,
  onRaiseHand,
  onSnapshot,
  onLeave,
  className,
}: MeetingControlsProps) {
  return (
    <div className={cn(
      "flex items-center justify-center gap-2 p-4 bg-card rounded-xl border",
      className
    )}>
      {/* Mute/Unmute */}
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="icon"
        className="w-12 h-12 rounded-full"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </Button>

      {/* Record Toggle (Manager/HR only) */}
      {canRecord && (
        <Button
          variant={isRecording ? "destructive" : "secondary"}
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={onToggleRecord}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <Square className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5 fill-current" />
          )}
        </Button>
      )}

      {/* Raise Hand */}
      <Button
        variant={isHandRaised ? "default" : "secondary"}
        size="icon"
        className="w-12 h-12 rounded-full"
        onClick={onRaiseHand}
        aria-label={isHandRaised ? "Lower hand" : "Raise hand"}
      >
        <Hand className={cn("w-5 h-5", isHandRaised && "animate-bounce")} />
      </Button>

      {/* Snapshot Transcript */}
      <Button
        variant="secondary"
        size="icon"
        className="w-12 h-12 rounded-full"
        onClick={onSnapshot}
        aria-label="Take transcript snapshot"
      >
        <Camera className="w-5 h-5" />
      </Button>

      {/* Leave */}
      <Button
        variant="destructive"
        size="icon"
        className="w-12 h-12 rounded-full"
        onClick={onLeave}
        aria-label="Leave meeting"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  );
}
