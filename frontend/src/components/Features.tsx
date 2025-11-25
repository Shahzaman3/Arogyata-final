import {
  Shield,
  Lock,
  Key,
  FileCheck,
  Users,
  Layers,
  Workflow,
  Globe,
  Fingerprint,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description:
      "Built from the ground up with privacy at the core. Your data stays encrypted and under your control at all times.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Military-grade AES-256 encryption ensures your sensitive information remains secure from unauthorized access.",
  },
  {
    icon: Key,
    title: "Self-Sovereign Identity",
    description:
      "Control your digital identity with decentralized identifiers (DIDs) and verifiable credentials.",
  },
  {
    icon: FileCheck,
    title: "Immutable Audit Logs",
    description:
      "Every action is recorded on the blockchain, providing transparent and tamper-proof audit trails.",
  },
  {
    icon: Users,
    title: "Granular Access Control",
    description:
      "Define precise permissions and access policies with role-based access control (RBAC).",
  },
  {
    icon: Layers,
    title: "Multi-Chain Support",
    description:
      "Seamlessly integrate with Ethereum, Polygon, Avalanche, and other leading blockchain networks.",
  },
  {
    icon: Workflow,
    title: "Smart Contract Automation",
    description:
      "Automate data workflows and enforce privacy policies with customizable smart contracts.",
  },
  {
    icon: Globe,
    title: "GDPR & Compliance Ready",
    description:
      "Built-in compliance tools to help meet GDPR, CCPA, and other data privacy regulations.",
  },
  {
    icon: Fingerprint,
    title: "Zero-Knowledge Proofs",
    description:
      "Verify information without revealing the underlying data using advanced cryptographic techniques.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Enterprise-Grade <span className="text-gradient-primary">Features</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build secure, privacy-focused decentralized
            applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
