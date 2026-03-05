import { Link } from "react-router-dom";
import { ClientsSection, type Stat, type Testimonial } from "@/components/ui/testimonial-card";
import yuryAvatar from "@/assets/testimonials/yury.jpg";
import annaAvatar from "@/assets/testimonials/anna.jpg";
import katjaAvatar from "@/assets/testimonials/katja.jpg";

const stats: Stat[] = [
  { value: "10+", label: "Years of Excellence" },
  { value: "150+", label: "Happy Clients" },
  { value: "100%", label: "Satisfaction" },
];

const testimonials: Testimonial[] = [
  {
    name: "Mr. Yury Chertkov",
    title: "Director, Novo Alliance Co., Ltd.",
    quote:
      "We were very satisfied with the quality of the service. The entire process was handled professionally and efficiently. We especially appreciate the quick turnaround, the prompt and helpful responses to our questions, and the clarity of the information provided throughout the process.",
    avatarSrc: yuryAvatar,
    rating: 5.0,
  },
  {
    name: "Anna",
    title: "Meridian Bridge Co., Ltd.",
    quote:
      "The audit team demonstrated a high level of professionalism and strong organizational skills. Communication was conducted in a professional and constructive manner, which contributed to efficient cooperation during the audit process.",
    avatarSrc: annaAvatar,
    rating: 5.0,
  },
  {
    name: "Katja Vanhanen",
    title: "Managing Partner, MPG Trade Co., Ltd.",
    quote:
      "We are very satisfied with the accounting and tax services provided by PND50. The process was handled professionally, accurately, and on time. We truly appreciate the high quality of service and customer support.",
    avatarSrc: katjaAvatar,
    rating: 5.0,
  },
];

export function Testimonials() {
  return (
    <ClientsSection
      tagLabel="Client Testimonials"
      title="Trusted by businesses across Thailand"
      description="Hear from the companies we've helped navigate Thai compliance with confidence."
      stats={stats}
      testimonials={testimonials}
      primaryActionLabel="Get in Touch"
      secondaryActionLabel="Our Services"
      className="bg-muted/30 border-y border-border/40"
    />
  );
}
