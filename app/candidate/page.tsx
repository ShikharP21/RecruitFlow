"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

export default function CandidatePage() {
  const { isAuthenticated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    } else if (user?.role === "recruiter") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user?.role, router]);

  if (!isAuthenticated || user?.role !== "candidate") return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                  {user?.role}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground text-center py-8">
              Welcome to your candidate profile! Your details have been saved.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}