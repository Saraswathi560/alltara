import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Briefcase, Shield, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/Header";
import { ConsentModal } from "@/components/ConsentModal";
import { useSession } from "@/context/SessionContext";
import type { ParticipantRole } from "@/types/review";

const roles = [
  {
    value: "employee" as const,
    label: "Employee",
    description: "I'm being reviewed",
    icon: Users,
  },
  {
    value: "manager" as const,
    label: "Manager",
    description: "I'm conducting the review",
    icon: Briefcase,
  },
  {
    value: "hr" as const,
    label: "HR / Recorder",
    description: "I'm observing and recording",
    icon: Shield,
  },
];

export default function JoinSession() {
  const navigate = useNavigate();
  const { joinSession, giveConsent } = useSession();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [role, setRole] = useState<ParticipantRole>("employee");
  const [showConsent, setShowConsent] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const isFormValid = name.trim() && email.trim() && sessionCode.trim();

  const handleJoin = () => {
    if (!isFormValid) return;
    setShowConsent(true);
  };

  const handleConsent = async () => {
    setIsJoining(true);
    
    // Join the session
    joinSession(sessionCode, {
      name,
      email,
      role,
    });
    
    giveConsent();
    
    // Navigate to meeting
    await new Promise((resolve) => setTimeout(resolve, 500));
    navigate("/meeting");
  };

  const handleDecline = () => {
    setShowConsent(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="bg-card rounded-2xl shadow-elevated p-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Join Performance Review
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter your details to join the three-way review session
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); handleJoin(); }} className="space-y-6">
              {/* Session Code */}
              <div className="space-y-2">
                <Label htmlFor="sessionCode">Session Code</Label>
                <Input
                  id="sessionCode"
                  placeholder="Enter session code"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="uppercase tracking-wider"
                />
              </div>
              
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Your Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as ParticipantRole)}
                  className="grid gap-3"
                >
                  {roles.map((r) => (
                    <label
                      key={r.value}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer
                        transition-all duration-200
                        ${role === r.value 
                          ? "border-primary bg-accent" 
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                        }
                      `}
                    >
                      <RadioGroupItem value={r.value} id={r.value} className="sr-only" />
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${role === r.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}
                      `}>
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{r.label}</p>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Session Info */}
              <div className="flex gap-4 p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>~45 min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <span>OKR Framework</span>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={!isFormValid || isJoining}
              >
                {isJoining ? "Joining..." : "Join Session"}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <ConsentModal
        open={showConsent}
        onConsent={handleConsent}
        onDecline={handleDecline}
        participantName={name}
      />
    </div>
  );
}
