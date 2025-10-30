import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import mosqueImage from "@assets/generated_images/Turkish_mosque_architecture_image_59f010a8.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            The Story of "Sanki Yedim"
          </h1>
          <p className="text-xl text-muted-foreground">
            How small daily choices built something extraordinary
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12 rounded-lg overflow-hidden border shadow-xl">
          <img
            src={mosqueImage}
            alt="Turkish mosque with intricate tile patterns"
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none space-y-6">
          <p className="text-lg leading-relaxed">
            In the heart of Istanbul stands the <strong>Sanki Yedim Camii</strong>—the "As If I Have Eaten" Mosque. 
            Its name carries a profound lesson about the power of micro-savings and daily discipline that resonates 
            across centuries.
          </p>

          <div className="border-l-4 border-primary pl-6 py-2 my-8 bg-muted/30 rounded-r">
            <p className="italic text-xl text-muted-foreground">
              "As if I have eaten"
            </p>
          </div>

          <p className="text-lg leading-relaxed">
            The story begins with a humble individual who made a simple decision: every time they felt the urge 
            to buy something unnecessary, they would set that money aside instead, as if they had already made 
            the purchase. Day after day, they repeated this practice—skipping the extra coffee, the impulse buy, 
            the treat they didn't truly need.
          </p>

          <p className="text-lg leading-relaxed">
            What seemed like insignificant amounts—a few coins here, a small bill there—accumulated over time 
            into something remarkable. These micro-savings, born from countless small acts of restraint, eventually 
            funded the construction of a beautiful mosque that still serves the community today. The building stands 
            not just as a place of worship, but as a monument to what persistent, disciplined saving can achieve.
          </p>

          <p className="text-lg leading-relaxed">
            This app embraces that same philosophy. Every skipped purchase, every mindful choice to save instead 
            of spend, contributes to your financial goals. Like the builder of Sanki Yedim Camii, you're not just 
            tracking numbers—you're building something meaningful through the compound effect of small, daily decisions.
          </p>

          <p className="text-lg leading-relaxed">
            The wisdom is timeless: <em>small choices, consistently made, create big results</em>. Whether you're 
            saving for a dream, building an emergency fund, or simply developing better financial habits, every 
            entry you log is a brick in your own monument to discipline and achievement.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border text-center">
          <h2 className="text-2xl font-serif mb-4">
            Start Building Your Own Story
          </h2>
          <p className="text-muted-foreground mb-6">
            Begin your journey of mindful saving today
          </p>
          <Button size="lg" data-testid="button-start-journey">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Attribution */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Story inspired by the traditional Turkish narrative of Sanki Yedim Camii.
            <br />
            Learn more about the{" "}
            <a
              href="https://iqranetwork.com/blog/the-story-of-the-turkish-mosqueas-if-i-have-eaten/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              original story
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
