import { motion } from "framer-motion";
import { Database, Shield, Server, Cpu } from "lucide-react";

interface IntegrationNode {
  icon: any;
  label: string;
  color: string;
  colorHex?: string;
  angle: number;
}

const nodes: IntegrationNode[] = [
  { icon: Database, label: "IPFS", color: "primary", angle: -45 },
  { icon: Shield, label: "Encryption", color: "secondary", angle: 45 },
  { icon: Server, label: "Blockchain", color: "accent", angle: 135 },
  { icon: Cpu, label: "Smart Contracts", color: "primary", angle: 225 },
];

export const BlockchainIntegration = () => {
  const radius = 40; // Percentage from center

  return (
    <section
      id="integration"
      className="relative py-20 bg-muted/30"
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
            Blockchain <span className="text-gradient-primary">Integration</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Seamlessly connect your application with decentralized infrastructure
          </p>
        </motion.div>

        {/* Integration Diagram */}
        <div className="relative max-w-4xl mx-auto h-96 md:h-[500px] flex items-center justify-center">
          {/* SVG Connections - thick diagonal gradient bars centered and animated */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(172 66% 50%)" stopOpacity="0.95" />
                <stop offset="50%" stopColor="hsl(250 70% 60%)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="hsl(300 65% 60%)" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* two thick bars crossing the center, rotated -45 and 45 degrees */}
            <motion.rect
              x="5"
              y="48.5"
              width="90"
              height="3.6"
              rx="1.8"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3.6"
              strokeLinecap="square"
              transform="rotate(-45 50 50)"
              initial={{ opacity: 0, strokeDashoffset: 60 }}
              whileInView={{ opacity: 1, strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            />
            <motion.rect
              x="5"
              y="48.5"
              width="90"
              height="3.6"
              rx="1.8"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3.6"
              strokeLinecap="square"
              transform="rotate(45 50 50)"
              initial={{ opacity: 0, strokeDashoffset: 60 }}
              whileInView={{ opacity: 1, strokeDashoffset: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.08 }}
            />
          </svg>

          {/* Center Hub */}
          <motion.div
            className="absolute top-1/2.5 left-1/2.5 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 bg-card rounded-full flex items-center justify-center z-20"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.18 }}
            style={{
              boxShadow: "0 0 40px rgba(16,185,129,0.12), inset 0 0 10px rgba(16,185,129,0.06)",
              border: "2px solid rgba(16,185,129,0.9)",
            }}
          >
            <div className="text-center">
              <div className="text-lg md:text-2xl font-extrabold text-gradient-primary">Arogyta</div>
              <div className="text-xs text-muted-foreground">Core</div>
            </div>
          </motion.div>

          {/* Integration Nodes - positions tuned to match supplied layout */}
          {nodes.map((node, index) => {
            const angleRad = (node.angle * Math.PI) / 180;
            // use a slightly larger radius for perfect visual spacing
            const layoutRadius = radius ?? 28; // keep your radius var if exists
            const effectiveRadius = layoutRadius + 6; // small nudge to align with bars
            const x = 50 + Math.cos(angleRad) * effectiveRadius;
            const y = 50 + Math.sin(angleRad) * effectiveRadius;
            const Icon = node.icon;

            return (
              <motion.div
                key={node.label}
                className="absolute z-30"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.36 + index * 0.06 }}
                whileHover={{ scale: 1.06 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="p-3 md:p-4 bg-card rounded-full glow-card hover:scale-110 transition-transform border"
                    style={{
                      borderColor: node.color || node.colorHex || "rgba(255,255,255,0.06)",
                      boxShadow: "0 6px 18px rgba(2,6,23,0.5)",
                    }}
                  >
                    <Icon size={22} style={{ color: node.color || node.colorHex }} />
                  </div>
                  <span className="text-xs md:text-sm font-medium bg-card px-2 md:px-3 py-1 rounded-full border border-border whitespace-nowrap">
                    {node.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Data Flow Animation - smaller particles, distance tuned to match layout */}
          {nodes.map((node, i) => {
            const angleRad = (node.angle * Math.PI) / 180;
            const maxDistance = 120; // px, reduced for layout parity with image
            const x = Math.cos(angleRad) * maxDistance;
            const y = Math.sin(angleRad) * maxDistance;

            return (
              <motion.div
                key={`flow-${i}`}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full shadow-glow pointer-events-none"
                style={{ background: node.color || node.colorHex || "var(--primary)" }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                animate={{
                  x: [0, x],
                  y: [0, y],
                  opacity: [0, 0.9, 0],
                  scale: [0.3, 0.95, 0.3],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>

        {/* Integration Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "<100ms", label: "Latency" },
            { value: "256-bit", label: "Encryption" },
            { value: "Multi-Chain", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-4 md:p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
