import { motion } from "framer-motion";
import { Database, Shield, Server, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export const BlockchainIntegration = () => {
  return (
    <section id="integration" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 50%)`
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Shield className="w-4 h-4" />
            <span>Enterprise Grade Security</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">Decentralized</span> Intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Arogyta leverages cutting-edge blockchain technology to ensure your health data remains immutable, secure, and completely under your control.
          </motion.p>
        </div>

        {/* Core Integration Visual */}
        <div className="grid lg:grid-cols-3 gap-8 items-center mb-24">
          {/* Left Column Features */}
          <div className="space-y-6">
            <FeatureCard
              icon={Database}
              title="IPFS Storage"
              description="Decentralized file storage ensures your medical records are distributed, redundant, and always accessible."
              delay={0.3}
            />
            <FeatureCard
              icon={Shield}
              title="Zero-Knowledge Encryption"
              description="Military-grade encryption where only you hold the keys. Not even we can access your data."
              delay={0.4}
            />
          </div>

          {/* Center Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] flex items-center justify-center"
          >
            {/* Animated Rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-primary/20 rounded-full"
                style={{ margin: `${i * 40}px` }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
              />
            ))}

            {/* Center Core */}
            <div className="relative w-32 h-32 bg-card rounded-full flex items-center justify-center border-2 border-primary shadow-[0_0_40px_rgba(12,120,75,0.3)] z-20">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <Server className="w-12 h-12 text-primary" />
            </div>

            {/* Connecting Lines (Decorative) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 400">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                  <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 50 100 Q 200 200 50 300"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <motion.path
                d="M 350 100 Q 200 200 350 300"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </motion.div>

          {/* Right Column Features */}
          <div className="space-y-6">
            <FeatureCard
              icon={Server}
              title="Immutable Ledger"
              description="Every access request and data modification is recorded on the blockchain for complete auditability."
              delay={0.5}
            />
            <FeatureCard
              icon={Cpu}
              title="Smart Contracts"
              description="Automated permission management ensures data is shared only when specific conditions are met."
              delay={0.6}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Network Uptime", value: "99.99%" },
            { label: "Block Time", value: "< 2s" },
            { label: "Encryption", value: "AES-256" },
            { label: "Gas Fees", value: "$0.00" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl text-center hover:bg-card transition-colors"
            >
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
