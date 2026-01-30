import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

// Icon component for contact details
const InfoIcon = ({ type }: { type: 'website' | 'phone' | 'address' }) => {
  const icons = {
    website: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    address: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
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
  contactInfo?: {
    website: string;
    phone: string;
    address: string;
  };
  tagline?: string;
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ className, logo, slogan, title, subtitle, callToAction, secondaryAction, backgroundImage, contactInfo, tagline, ...props }, ref) => {
    
    // Animation variants for the container to orchestrate children animations
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2,
        },
      },
    };

    // Animation variants for individual text/UI elements
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      },
    };
    
    return (
      <div ref={ref} className={cn("relative min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row overflow-hidden bg-background", className)} {...props}>
        {/* Left Side: Content */}
        <motion.div 
          className="w-full lg:w-2/3 flex flex-col justify-between p-8 md:p-12 lg:p-16 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Section: Logo & Main Content */}
          <div className="flex flex-col gap-8 md:gap-12">
            {logo && (
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                {logo.url && (
                  <img src={logo.url} alt={logo.alt || "Logo"} className="h-10 w-auto" />
                )}
                <div className="flex flex-col">
                  {logo.text && <span className="text-xl font-bold tracking-tight">{logo.text}</span>}
                  {slogan && <span className="text-xs text-muted-foreground uppercase tracking-wider">{slogan}</span>}
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-6 max-w-xl">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
              >
                {title}
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg text-muted-foreground"
              >
                {subtitle}
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href={callToAction.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors neumorphic-button group"
                >
                  {callToAction.text}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                {secondaryAction && (
                  <a 
                    href={secondaryAction.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-lg border border-border bg-background hover:bg-accent transition-colors group"
                  >
                    {secondaryAction.text}
                    <svg className="w-4 h-4 opacity-0 -ml-4 transition-all group-hover:opacity-100 group-hover:ml-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                )}
              </motion.div>

              {tagline && (
                <motion.p 
                  variants={itemVariants}
                  className="text-sm text-muted-foreground/60 pt-2"
                >
                  {tagline}
                </motion.p>
              )}
            </div>
          </div>

          {/* Bottom Section: Footer Info */}
          {contactInfo && (
            <motion.div 
              variants={itemVariants}
              className="mt-12 lg:mt-0 pt-8 border-t border-border/40"
            >
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
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
            </motion.div>
          )}
        </motion.div>

        {/* Right Side: Visual with gradient overlay */}
        <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full">
          {backgroundImage ? (
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
              animate={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img 
                src={backgroundImage} 
                alt="Hero background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"
              initial={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
              animate={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Grid pattern */}
              <div className="absolute inset-0 hero-grid-pattern opacity-60" />
              
              {/* Floating orbs */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-primary/15 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
