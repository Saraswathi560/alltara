import { TaraLogo } from "./TaraLogo";

export function Header() {
  return (
    <header className="w-full px-6 py-4 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <img src="/TRANSPARENT LOGO.png" alt="Tara"/>
        </div>
        <span className="text-xl font-semibold text-primary">TalentSpotify</span>
      </div>
    </header>
  );
}
