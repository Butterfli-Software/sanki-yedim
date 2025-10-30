import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Wallet } from "lucide-react";
import heroImage from "@assets/generated_images/Coffee_shop_savings_hero_image_6871e15a.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Savings inspiration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h1 className="text-hero-mobile md:text-hero font-serif mb-6">
            Little Choices. Big Results.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Track what you didn't buy and watch your savings grow. Inspired by the timeless wisdom of daily discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-white text-foreground hover:bg-white/90"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-learn-story"
            >
              Learn the Story
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Log What You Saved</h3>
              <p className="text-muted-foreground">
                Every time you skip a purchase, log it. That coffee you didn't buy? That's savings.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Watch your savings add up with visual charts, streaks, and monthly goals.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Move to Savings</h3>
              <p className="text-muted-foreground">
                Get a simple checklist to transfer your virtual savings into real savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$2,450</div>
              <div className="text-muted-foreground">Average First Year Savings</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">89%</div>
              <div className="text-muted-foreground">Users Hit Their Goals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">45</div>
              <div className="text-muted-foreground">Day Average Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="aspect-video rounded-lg overflow-hidden border shadow-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M5 21V7l8-4v18M13 7l8 4v10" />
                      <path d="M7 11h.01M7 14h.01M7 17h.01M11 11h.01M11 14h.01M11 17h.01" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Turkish Architecture</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 space-y-4">
              <blockquote className="text-xl italic border-l-4 border-primary pl-4 text-muted-foreground">
                "As if I have eaten"—a simple phrase that built something extraordinary through the power of small, daily discipline.
              </blockquote>
              <p className="text-muted-foreground">
                The Sanki Yedim Camii stands as a testament to what micro-savings can achieve. Discover the inspiring story behind this app.
              </p>
              <Button variant="outline" data-testid="button-read-story">
                Read the Full Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">
            Start Your Savings Journey Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who are turning small choices into meaningful savings.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            data-testid="button-cta-signup"
          >
            Sign Up Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
