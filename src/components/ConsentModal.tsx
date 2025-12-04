import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mic, Shield, Clock, Users } from "lucide-react";

interface ConsentModalProps {
  open: boolean;
  onConsent: () => void;
  onDecline: () => void;
  participantName: string;
}

export function ConsentModal({
  open,
  onConsent,
  onDecline,
  participantName,
}: ConsentModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleConsent = async () => {
    setIsRecording(true);
    // Simulate consent phrase recording
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRecording(false);
    onConsent();
  };

  const consentPoints = [
    {
      icon: Mic,
      title: "Audio Recording",
      description: "This session will be recorded for accuracy and documentation purposes.",
    },
    {
      icon: Clock,
      title: "Data Retention",
      description: "Recording and transcript will be retained for 36 months per company policy.",
    },
    {
      icon: Users,
      title: "Access Rights",
      description: "Only HR, your manager, and you will have access to the full recording.",
    },
    {
      icon: Shield,
      title: "Bias Handling",
      description: "TARA will flag potential biases and suggest neutral rephrases during the review.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Consent Required
          </DialogTitle>
          <DialogDescription>
            Please review and acknowledge the following before joining the session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {consentPoints.map((point) => (
            <div key={point.title} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <point.icon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm">{point.title}</p>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 pt-4 border-t">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <Label htmlFor="acknowledge" className="text-sm leading-relaxed cursor-pointer">
              I understand and agree to the terms above. I consent to have my voice recorded
              during this performance review session.
            </Label>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm">
              Please say: "I, {participantName}, consent to this review recording."
            </span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onDecline} disabled={isRecording}>
            I do not consent
          </Button>
          <Button
            variant="default"
            onClick={handleConsent}
            disabled={!acknowledged || isRecording}
          >
            {isRecording ? (
              <>
                <Mic className="w-4 h-4 animate-pulse" />
                Recording...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                I consent
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
