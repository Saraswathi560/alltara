import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ParticipantList } from "@/components/ParticipantList";
import { LiveTranscript } from "@/components/LiveTranscript";
import { AssistantPrompt } from "@/components/AssistantPrompt";
import { MeetingControls } from "@/components/MeetingControls";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, BarChart3 } from "lucide-react";
import type { Participant, TranscriptEntry } from "@/types/review";

// Mock data for demo
const mockParticipants: Participant[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "employee",
    status: "connected",
    isSpeaking: false,
    consentGiven: true,
  },
  {
    id: "2",
    name: "Michael Park",
    email: "michael@company.com",
    role: "manager",
    status: "connected",
    isSpeaking: true,
    consentGiven: true,
  },
  {
    id: "3",
    name: "Lisa Wong",
    email: "lisa@company.com",
    role: "hr",
    status: "connected",
    isSpeaking: false,
    consentGiven: true,
  },
];

const mockTranscript: TranscriptEntry[] = [
  {
    id: "t1",
    timestamp: new Date(Date.now() - 120000),
    speaker: "TARA",
    role: "assistant",
    text: "Welcome to this performance review session. Let's begin by reviewing Sarah's key results for Q4.",
    isFinal: true,
  },
  {
    id: "t2",
    timestamp: new Date(Date.now() - 90000),
    speaker: "Michael Park",
    role: "manager",
    text: "Sarah, let's start with your first objective around customer retention. Can you walk us through your progress?",
    isFinal: true,
  },
  {
    id: "t3",
    timestamp: new Date(Date.now() - 60000),
    speaker: "Sarah Chen",
    role: "employee",
    text: "Sure, we achieved a 94% retention rate this quarter, which exceeded our target of 90%. I implemented a new onboarding flow that reduced churn in the first 30 days.",
    isFinal: true,
  },
];

export default function Meeting() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, currentParticipant, isRecording, dispatch } = useSession();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(mockTranscript);
  const [assistantPrompt, setAssistantPrompt] = useState(
    "Let's discuss the evidence for this key result. Sarah, what metrics or examples support your achievement?"
  );

  // Use mock data if no session
  const participants = session?.participants || mockParticipants;
  const canRecord = currentParticipant?.role === "manager" || currentParticipant?.role === "hr";

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Microphone unmuted" : "Microphone muted",
    });
  };

  const handleToggleRecord = () => {
    dispatch({ type: "SET_RECORDING", payload: !isRecording });
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Session recording has been paused." : "Session is now being recorded.",
    });
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    toast({
      title: isHandRaised ? "Hand lowered" : "Hand raised",
    });
  };

  const handleSnapshot = () => {
    toast({
      title: "Transcript snapshot saved",
      description: `${transcript.length} entries captured.`,
    });
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto h-full">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <StatusIndicator status={isRecording ? "active" : "ready"} />
              {isRecording && (
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  Recording
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/review")}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Review Panel
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/scoring")}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Scoring
              </Button>
            </div>
          </div>
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
            {/* Left Sidebar - Participants */}
            <div className="lg:col-span-1 bg-card rounded-xl border p-4 overflow-y-auto">
              <ParticipantList participants={participants} />
            </div>
            
            {/* Center - Transcript */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <AssistantPrompt prompt={assistantPrompt} />
              <LiveTranscript entries={transcript} className="flex-1" />
            </div>
            
            {/* Right - Controls & Info */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-card rounded-xl border p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Session Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code</span>
                    <span className="font-mono font-medium">
                      {session?.code || "DEMO123"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">12:34</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="font-medium">{participants.length}/3</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1" />
              
              <MeetingControls
                isRecording={isRecording}
                isMuted={isMuted}
                isHandRaised={isHandRaised}
                canRecord={canRecord || true}
                onToggleMute={handleToggleMute}
                onToggleRecord={handleToggleRecord}
                onRaiseHand={handleRaiseHand}
                onSnapshot={handleSnapshot}
                onLeave={handleLeave}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
