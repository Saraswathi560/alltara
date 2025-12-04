import { Phone, PhoneOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TaraLogo } from "@/components/TaraLogo";
import { StatusIndicator } from "@/components/StatusIndicator";
import { FeatureCard } from "@/components/FeatureCard";
import { useVapi } from "@/hooks/useVapi";

export default function Landing() {
  const { status, isConnected, isSpeaking, start, stop } = useVapi();

  const handleConnect = async () => {
    if (isConnected) {
      stop();
    } else {
      await start();
    }
  };

  const getStatusType = () => {
    if (status === 'connecting') return 'connecting';
    if (isConnected) return 'active';
    if (status === 'error') return 'error';
    return 'ready';
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'connecting': return 'Connecting to Tara...';
      case 'connected': return 'Connected - Listening';
      case 'speaking': return 'Tara is speaking...';
      case 'listening': return 'Listening...';
      case 'error': return 'Connection error';
      default: return 'Voice assistant ready';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-card rounded-2xl shadow-elevated p-8 text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <img src="/TRANSPARENT LOGO.png" alt="Tara"/>
            </div>
            
            <h1 className="text-2xl font-bold text-card-foreground mb-2">TARA</h1>
            <p className="text-muted-foreground mb-8">
              Your HR performance review voice assistant
            </p>
            
            <Button
              variant={isConnected ? "destructive" : "hero"}
              size="xl"
              className="w-full"
              onClick={handleConnect}
              disabled={status === 'connecting'}
            >
              {isConnected ? (
                <>
                  <PhoneOff className="w-5 h-5" />
                  End Call
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  {status === 'connecting' ? "Connecting..." : "Connect with Tara"}
                </>
              )}
            </Button>
            
            <div className="mt-6">
              <StatusIndicator 
                status={getStatusType()} 
                label={getStatusLabel()}
                className="justify-center"
              />
            </div>

            {isSpeaking && (
              <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 16 + 8}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Feature Card */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
            <FeatureCard
              icon={Sparkles}
              title="Performance reviews made simple"
              features={[
                "Natural conversation",
                "Instant insights",
                "Personalized feedback",
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

