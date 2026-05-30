import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: "🌐",
    label: "Your Website",
    description: "Add one <script> tag to your HTML",
    color: "#8B5CF6",
  },
  {
    id: 2,
    icon: "📡",
    label: "Beacon Fires",
    description: "Visitor data sent via navigator.sendBeacon",
    color: "#06B6D4",
  },
  {
    id: 3,
    icon: "⚡",
    label: "Traffic Server",
    description: "Bun server receives & stores raw events",
    color: "#10B981",
  },
  {
    id: 4,
    icon: "🗄️",
    label: "MongoDB",
    description: "Raw track data persisted in Track collection",
    color: "#F59E0B",
  },
  {
    id: 5,
    icon: "⏱️",
    label: "Cron Job",
    description: "Every 15 min: aggregates all track records",
    color: "#EC4899",
  },
  {
    id: 6,
    icon: "📊",
    label: "Your Dashboard",
    description: "Beautiful metrics, charts & insights",
    color: "#8B5CF6",
  },
];

const Arrow = ({ index, total }: { index: number; total: number }) => {
  if (index >= total - 1) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.4 }}
      className="flex items-center justify-center"
    >
      <svg width="32" height="12" viewBox="0 0 32 12" className="hidden md:block">
        <motion.path
          d="M0 6 L24 6 M18 1 L24 6 L18 11"
          stroke="#6B7280"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 + index * 0.15, duration: 0.4 }}
        />
      </svg>
      <svg width="12" height="32" viewBox="0 0 12 32" className="md:hidden">
        <motion.path
          d="M6 0 L6 24 M1 18 L6 24 L11 18"
          stroke="#6B7280"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 + index * 0.15, duration: 0.4 }}
        />
      </svg>
    </motion.div>
  );
};

export default function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          How it works
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How it works</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm mb-6">
          From a single script tag to a fully populated analytics dashboard — here's the complete data flow.
        </p>

        {/* Flow diagram */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0 py-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex flex-col md:flex-row items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.4, type: "spring" }}
                className="flex flex-col items-center text-center w-24"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2 shadow-lg"
                  style={{ backgroundColor: step.color + "20", border: `2px solid ${step.color}40` }}
                >
                  {step.icon}
                </motion.div>
                <p className="text-xs font-semibold leading-tight" style={{ color: step.color }}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">{step.description}</p>
              </motion.div>
              <Arrow index={i} total={steps.length} />
            </div>
          ))}
        </div>

        {/* Embed code preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-6 rounded-xl border bg-muted/30 p-4"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Step 1 — Add to your HTML</p>
          <pre className="text-sm font-mono text-green-400 bg-black/40 rounded-lg p-3 overflow-x-auto">
{`<script src="https://track.glasscube.io/embed.js?key=YOUR_KEY"></script>`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">That's it. One line. Zero configuration. Data starts flowing immediately.</p>
        </motion.div>

        {/* Key facts */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {[
            { label: "15 min intervals", desc: "Metrics aggregated automatically" },
            { label: "No cookies", desc: "Privacy-first analytics" },
            { label: "Anonymous data", desc: "No personal info stored" },
          ].map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="rounded-lg border bg-muted/20 p-3"
            >
              <p className="text-sm font-semibold">{fact.label}</p>
              <p className="text-xs text-muted-foreground">{fact.desc}</p>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
