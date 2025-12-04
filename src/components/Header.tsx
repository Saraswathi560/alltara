import { TaraLogo } from "./TaraLogo";

export function Header() {
  return (
    <header className="w-full px-6 py-4 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="6" className="fill-primary" />
            <circle cx="50" cy="25" r="4" className="fill-primary" />
            <circle cx="71" cy="37" r="4" className="fill-primary" />
            <circle cx="71" cy="63" r="4" className="fill-primary" />
            <circle cx="50" cy="75" r="4" className="fill-primary" />
            <circle cx="29" cy="63" r="4" className="fill-primary" />
            <circle cx="29" cy="37" r="4" className="fill-primary" />
            <line x1="50" y1="44" x2="50" y2="29" stroke="hsl(var(--primary))" strokeWidth="2" />
            <line x1="55" y1="47" x2="67" y2="40" stroke="hsl(var(--primary))" strokeWidth="2" />
            <line x1="55" y1="53" x2="67" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" />
            <line x1="50" y1="56" x2="50" y2="71" stroke="hsl(var(--primary))" strokeWidth="2" />
            <line x1="45" y1="53" x2="33" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" />
            <line x1="45" y1="47" x2="33" y2="40" stroke="hsl(var(--primary))" strokeWidth="2" />
          </svg>
        </div>
        <span className="text-xl font-semibold text-primary">TalentSpotify</span>
      </div>
    </header>
  );
}
