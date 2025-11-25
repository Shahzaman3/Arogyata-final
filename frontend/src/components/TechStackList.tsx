import { useEffect, useRef } from "react";
import { Database, Shield, Cpu, Cloud, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const technologies = [
  {
    icon: Database,
    name: "IPFS Storage",
    description: "Decentralized file storage with content addressing",
    color: "text-primary",
  },
  {
    icon: Shield,
    name: "Zero-Knowledge Proofs",
    description: "Privacy-preserving verification without revealing data",
    color: "text-secondary",
  },
  {
    icon: Cpu,
    name: "Smart Contracts",
    description: "Automated execution on Ethereum & Polygon networks",
    color: "text-accent",
  },
  {
    icon: Cloud,
    name: "Decentralized Identity",
    description: "Self-sovereign identity management with DID standards",
    color: "text-primary",
  },
  {
    icon: Lock,
    name: "End-to-End Encryption",
    description: "Military-grade AES-256 encryption for all data",
    color: "text-secondary",
  },
  {
    icon: Zap,
    name: "Lightning Network",
    description: "Instant micropayments with minimal gas fees",
    color: "text-accent",
  },
];

export const TechStackList = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section
      id="technology"
      className="relative py-20 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Technology <span className="text-gradient-primary">Stack</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on cutting-edge Web3 technologies for uncompromising security and
            performance
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                variants={cardVariants}
                className="relative p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <tech.icon className={tech.color} size={24} />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
