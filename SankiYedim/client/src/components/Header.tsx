import { Link } from "wouter";
import { Navigation } from "./Navigation";
import { Coins } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold hidden sm:inline">
              Sanki Yedim
            </span>
          </div>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
