import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

const badges = [
  { icon: Shield, label: "Secure" },
  { icon: Zap, label: "Fast" },
  { icon: Lock, label: "Private" },
];

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true });

  useEffect(() => {
    if (isInView && heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".hero-title", {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
        gsap.from(".hero-subtitle", {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        });
        gsap.from(".hero-cta", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        });
        gsap.from(".hero-badge", {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          delay: 0.9,
          stagger: 0.1,
          ease: "back.out(1.7)",
        });
      }, heroRef);

      return () => ctx.revert();
    }
  }, [isInView]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Title */}
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Web3 Data Privacy
            <br />
            <span className="text-gradient-primary">Made Simple</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Empower your decentralized applications with enterprise-grade privacy
            controls and seamless blockchain integration
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="hero-cta bg-primary hover:bg-primary-glow text-primary-foreground glow-primary text-lg px-8 py-6 w-full sm:w-auto"
            >
              Start Building
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="hero-cta border-2 border-border hover:border-primary text-lg px-8 py-6 w-full sm:w-auto"
            >
              View Documentation
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.label}
                className="hero-badge flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <badge.icon className="text-primary" size={20} />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
