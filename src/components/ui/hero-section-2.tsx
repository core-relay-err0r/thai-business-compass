import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

// Icon component for contact details
const InfoIcon = ({
  type
}: {
  type: 'website' | 'phone' | 'address';
}) => {
  const icons = {
    website: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>,
    phone: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>,
    address: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
  };
  return <div className="p-2 rounded-full bg-primary/10 text-primary">{icons[type]}</div>;
};

// Prop types for the HeroSection component
interface HeroSectionProps {
  className?: string;
  logo?: {
    url?: string;
    alt?: string;
    text?: string;
  };
  slogan?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  slides?: {
    image: string;
    title: string;
    description: string;
  }[];
  contactInfo?: {
    website: string;
    phone: string;
    address: string;
  };
  tagline?: string;
}
const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(({
  className,
  logo,
  slogan,
  title,
  subtitle,
  callToAction,
  secondaryAction,
  backgroundImage,
  slides,
  contactInfo,
  tagline,
  ...props
}, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Animation variants for individual text/UI elements
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };
  return <div ref={ref} className={cn("relative w-full flex flex-col lg:flex-row bg-background min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] overflow-x-hidden", className)} {...props}>
        {/* Mobile Background Image */}
        {slides && slides.length > 0 && <div className="lg:hidden absolute inset-0 z-0">
            <img src={slides[0].image} alt="" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          </div>}
        
        {/* Left Side: Content */}
        <motion.div className="w-full lg:w-[60%] flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 lg:pl-[8%] xl:pl-[10%] relative z-10 py-12 sm:py-16 lg:py-24 xl:py-28" variants={containerVariants} initial="hidden" animate="visible">
          {/* Top Section: Logo & Main Content */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-14 lg:my-auto">
            {logo && <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-3">
                {logo.url && <img src={logo.url} alt={logo.alt || "Logo"} className="h-8 sm:h-10 w-auto" />}
                <div className="flex flex-col">
                  {logo.text && <span className="text-lg sm:text-xl font-bold tracking-tight">{logo.text}</span>}
                  {slogan && <span className="text-xs text-primary uppercase tracking-wider font-medium">{slogan}</span>}
                </div>
              </motion.div>}

            {/* Mobile Image Carousel */}
            {slides && slides.length > 0 && <motion.div variants={itemVariants} className="lg:hidden relative rounded-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={currentSlide} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.6
            }} className="relative aspect-[16/10]">
                    <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    
                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-background/90 text-foreground border border-border rounded-full mb-2">
                        {slides[currentSlide].title}
                      </span>
                      <p className="text-xs text-foreground/80 line-clamp-2">
                        {slides[currentSlide].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Slide indicators */}
                <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                  {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={cn("w-1.5 h-1.5 rounded-full transition-all duration-300", index === currentSlide ? "bg-primary w-4" : "bg-muted-foreground/40")} aria-label={`Go to slide ${index + 1}`} />)}
                </div>
              </motion.div>}

            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 max-w-2xl lg:py-12 xl:py-16">
              <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.15]">
                {title}
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed lg:text-lg">
                {subtitle}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <a href={callToAction.href} className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors neumorphic-button group min-h-[44px]">
                  {callToAction.text}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {secondaryAction && <a href={secondaryAction.href} className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 text-sm font-medium rounded-lg border border-border bg-background transition-colors group min-h-[44px]">
                    {secondaryAction.text}
                    <svg className="w-4 h-4 opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>}
              </motion.div>

              {tagline && <motion.p variants={itemVariants} className="text-xs sm:text-sm text-muted-foreground/60 pt-1 sm:pt-2">
                  {tagline}
                </motion.p>}
            </div>
          </div>

          {/* Bottom Section: Footer Info - Desktop only */}
          {contactInfo && <motion.div variants={itemVariants} className="hidden lg:block mt-8 sm:mt-10 lg:mt-0 pt-6 sm:pt-8 border-t border-border/40">
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <InfoIcon type="website" />
                  {contactInfo.website}
                </div>
                <div className="flex items-center gap-2">
                  <InfoIcon type="phone" />
                  {contactInfo.phone}
                </div>
                <div className="flex items-center gap-2">
                  <InfoIcon type="address" />
                  {contactInfo.address}
                </div>
              </div>
            </motion.div>}
        </motion.div>

        {/* Right Side: Visual with diagonal clip */}
        <div className="hidden lg:block absolute top-0 right-0 w-[40%] h-full" style={{
      clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
    }}>
          {slides && slides.length > 0 ? <motion.div className="absolute inset-0" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }}>
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.8
          }} className="absolute inset-0">
                  <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
                  {/* Gradient overlays for fading effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 via-20% to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 via-30% to-transparent" />
                  
                  {/* Text overlay */}
                  <motion.div className="absolute bottom-0 left-0 right-0 p-8" initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.3,
              duration: 0.5
            }}>
                    <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider bg-background/90 text-foreground border border-border rounded-full mb-3">
                      {slides[currentSlide].title}
                    </span>
                    <p className="text-sm text-foreground/80 max-w-xs">
                      {slides[currentSlide].description}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={cn("w-2 h-2 rounded-full transition-all duration-300", index === currentSlide ? "bg-primary w-6" : "bg-muted-foreground/40 hover:bg-muted-foreground/60")} aria-label={`Go to slide ${index + 1}`} />)}
              </div>
            </motion.div> : backgroundImage ? <motion.div className="absolute inset-0" initial={{
        clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)"
      }} animate={{
        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)"
      }} transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }}>
              <img src={backgroundImage} alt="Hero background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
            </motion.div> : <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5" initial={{
        clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)"
      }} animate={{
        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)"
      }} transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }}>
              {/* Grid pattern */}
              <div className="absolute inset-0 hero-grid-pattern opacity-60" />
              
              {/* Floating orbs */}
              <motion.div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }} transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
              <motion.div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-primary/15 blur-3xl" animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }} transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }} />
            </motion.div>}
        </div>
      </div>;
});
HeroSection.displayName = "HeroSection";
export { HeroSection };