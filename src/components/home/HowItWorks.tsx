import { MessageSquareText, FileSearch, Send } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    number: "01",
    title: "Answer a few questions",
    description: "Tell us about your company setup, team size, and operations. Takes about 2 minutes.",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Get your scope + pricing",
    description: "See exactly what's required, what's recommended, and what you don't need. With clear pricing.",
  },
  {
    icon: Send,
    number: "03",
    title: "Submit a structured request",
    description: "Your answers auto-fill the request form. Review and submit. We reply with next steps.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From questions to quote in minutes. No calls required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-border" />
              )}
              <div className="text-center relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary mx-auto mb-4 relative z-10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-xs font-medium text-muted-foreground mb-2">{step.number}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
