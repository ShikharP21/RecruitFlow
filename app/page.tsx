"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import Header from "@/components/layout/Header";

export default function LandingPage() {
  const { isAuthenticated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role === "recruiter") {
      router.replace("/dashboard");
    } else if (isAuthenticated && user?.role === "candidate") {
      router.replace("/candidate");
    }
  }, [isAuthenticated, user?.role, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="relative px-4 py-20 bg-gradient-to-br from-primary/5 to-accent/5 flex-1">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-6 leading-tight">
              AI-Powered
              <br />
              <span className="text-5xl md:text-7xl lg:text-8xl">Recruiting</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Transform hiring with intelligent candidate filtering
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/10 rounded-xl p-4">
                  <div className="text-3xl font-bold text-primary mb-1">98%</div>
                  <div className="text-sm text-muted-foreground">Match Accuracy</div>
                </div>
                <div className="bg-accent/10 rounded-xl p-4">
                  <div className="text-3xl font-bold text-accent mb-1">5x</div>
                  <div className="text-sm text-muted-foreground">Faster Hiring</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
