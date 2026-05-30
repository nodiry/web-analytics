import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { siteConfig } from "../siteConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, BarChart3, Loader2 } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleSignUpButton } from "./google";
import { Separator } from "@/components/ui/separator";

export default function SignUp() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", firstname: "", lastname: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { setError("Please fill all required fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(siteConfig.links.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      navigate("/auth/signin");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your website today</p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-5">
          <GoogleOAuthProvider clientId={siteConfig.links.client}>
            <GoogleSignUpButton />
          </GoogleOAuthProvider>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive text-center">
                {error}
              </motion.p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstname" className="text-xs">First name</Label>
                <Input id="firstname" name="firstname" placeholder="John" value={form.firstname} onChange={handleChange} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastname" className="text-xs">Last name</Label>
                <Input id="lastname" name="lastname" placeholder="Doe" value={form.lastname} onChange={handleChange} className="h-9 text-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-xs">Username <span className="text-destructive">*</span></Label>
              <Input id="username" name="username" placeholder="johndoe" value={form.username} onChange={handleChange} className="h-9 text-sm" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="h-9 text-sm" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input id="password" type={visible ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="h-9 text-sm pr-9" required />
                <button type="button" onClick={() => setVisible(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
