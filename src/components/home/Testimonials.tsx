import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Mr. Yury Chertkov",
    position: "Director",
    company: "Novo Alliance Co., Ltd.",
    quote:
      "We were very satisfied with the quality of the service. The entire process was handled professionally and efficiently. We especially appreciate the quick turnaround, the prompt and helpful responses to our questions, and the clarity of the information provided throughout the process. All communication was straightforward and well-organized, which made the experience smooth and easy for us. Overall, the service met our expectations and we would gladly recommend it to others looking for reliable and responsive support.",
  },
  {
    name: "Anna",
    position: "",
    company: "Meridian Bridge Co., Ltd.",
    quote:
      "The audit team demonstrated a high level of professionalism and strong organizational skills. Throughout the engagement, the auditors responded promptly to requests and provided timely clarifications and well-reasoned explanations on arising matters. Communication was conducted in a professional and constructive manner, which contributed to efficient cooperation during the audit process. The comments and recommendations issued as a result of the audit are well-founded, precise, and practically applicable, and are aimed at improving transparency, accuracy of accounting, and the effectiveness of internal control procedures.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-muted/30 border-y border-border/40">
      <div className="container py-16 md:py-24 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
            Client Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Trusted by businesses{" "}
            <span className="text-primary">across Thailand</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
            Hear from the companies we've helped navigate Thai compliance with
            confidence.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="max-w-3xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-border/50 relative overflow-hidden">
                {/* Decorative gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                <CardContent className="p-6 sm:p-8 md:p-10">
                  {/* Quote icon */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <blockquote className="text-sm sm:text-base leading-relaxed text-muted-foreground italic mb-8">
                    "{t.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder with initials */}
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold text-sm">
                        {t.name
                          .replace(/^(Mr\.|Mrs\.|Ms\.)\s*/, "")
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">
                        {t.name}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {t.position}, {t.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
