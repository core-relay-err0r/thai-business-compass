import { ClientsSection, type Testimonial } from "@/components/ui/testimonial-card";
import yuryAvatar from "@/assets/testimonials/yury.jpg";
import annaAvatar from "@/assets/testimonials/anna.jpg";
import katjaAvatar from "@/assets/testimonials/katja.jpg";

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
      tagLabel="Evidence, not promises"
      title="What competent execution sounds like"
      description="Clients describe the things that matter when the work is statutory: clarity, accuracy, speed, and control."
      stats={[]}
      testimonials={testimonials}
      primaryActionLabel="Contact us"
      primaryActionHref="/contact"
      secondaryActionLabel="Compare your scope"
      secondaryActionHref="/services"
      className="bg-background"
    />
  );
}
