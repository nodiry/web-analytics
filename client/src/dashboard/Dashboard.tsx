import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import NavBar from "../components/NavBar";
import WebsiteCreator from "@/components/creator";
import { words } from "@/textConfig";
import WebsiteCard from "@/components/webcard";
import { Globe } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<any[] | null>(null);

  useEffect(() => {
    try {
      const webs = localStorage.getItem("web");
      if (webs) setWebsites(JSON.parse(webs));
      else navigate("/");
    } catch {
      navigate("/");
    }
  }, [navigate]);

  if (!websites) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{words.dashboard}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {websites.length} website{websites.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
          {websites.length > 0 && <WebsiteCreator />}
        </motion.div>

        {/* Content */}
        {websites.length > 0 ? (
          <div className="space-y-4">
            {websites.map((w, i) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <WebsiteCard website={w} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-border"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{words.nowebmes}</h2>
            <p className="text-muted-foreground text-sm mb-6 text-center max-w-xs">
              Add your first website to start tracking analytics
            </p>
            <WebsiteCreator />
          </motion.div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
