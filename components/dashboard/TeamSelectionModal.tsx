"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Candidate } from "@/lib/types";
import { Toast } from "@/lib/toast";
import {
  X,
  Mail,
  Users,
  CheckCircle,
  FileText,
  MapPin,
} from "lucide-react";

interface TeamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
}

export const TeamSelectionModal = ({
  isOpen,
  onClose,
  candidates,
}: TeamSelectionModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isValidEmail(email)) {
      Toast.error("Invalid email", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Generate the team report
      const teamReport = generateTeamReport(candidates);

      // Create mailto URL with pre-filled content
      const subject = encodeURIComponent(
        `Hiring Team Report - ${candidates.length} Diverse Candidates`
      );
      const body = encodeURIComponent(teamReport);
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

      // Open the default email client
      window.open(mailtoUrl, "_blank");

      setIsEmailSent(true);
      Toast.success(
        "Email client opened!",
        `Your hiring team report is ready to share.`
      );

      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setIsEmailSent(false);
        setEmail("");
      }, 3000);
    } catch {
      Toast.error(
        "Failed to open email client",
        "Please try again or use the PDF export option."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFExport = async () => {
    try {
      // TODO: Implement PDF generation
      Toast.loading("Generating PDF", "Creating your team report...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate PDF generation

      // Create a simple text file for now (replace with actual PDF generation)
      const teamData = generateTeamReport(candidates);
      const blob = new Blob([teamData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `team-report-${candidates.length}-candidates-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Toast.success(
        "Hiring report downloaded!",
        "Your diverse team selection has been saved."
      );
    } catch {
      Toast.error("Export failed", "Please try again.");
    }
  };

  const generateTeamReport = (candidates: Candidate[]) => {
    const formatSalary = (salary: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(salary);
    };

    let report = `HIRING TEAM REPORT\n`;
    report += `Generated on: ${new Date().toLocaleDateString()}\n`;
    report += `Diverse Team Size: ${candidates.length} candidates\n\n`;

    candidates.forEach((candidate, index) => {
      report += `${index + 1}. ${candidate.name || ""}\n`;
      report += `   Email: ${candidate.email}\n`;
      report += `   Location: ${candidate.location || "Unknown"}\n`;
      report += `   Work Availability: ${
        candidate.work_availability?.join(", ") || "Unknown"
      }\n`;
      report += `   Salary: ${formatSalary(candidate.salaryNumeric || 0)}\n`;
      report += `   Skills: ${
        candidate.skills?.join(", ") || "No skills listed"
      }\n`;
      report += `   Experience: ${
        candidate.work_experiences?.length || 0
      } positions\n`;
      report += `   Education: ${
        candidate.education?.highest_level || "Unknown"
      }\n`;
      if (candidate.matchScore) {
        report += `   Match Score: ${candidate.matchScore}%\n`;
      }
      report += `\n`;
    });

    // Add team summary
    const avgSalary =
      candidates.reduce((sum, c) => sum + (c.salaryNumeric || 0), 0) /
      candidates.length;
    const topSchoolCount = candidates.filter((c) => c.isTopSchool).length;
    const uniqueLocations = new Set(candidates.map((c) => c.location)).size;

    report += `HIRING TEAM SUMMARY:\n`;
    report += `Average Salary: ${formatSalary(avgSalary)}\n`;
    report += `Top School Graduates: ${topSchoolCount}/${candidates.length}\n`;
    report += `Geographic Diversity: ${uniqueLocations} locations\n`;

    return report;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl max-h-[96vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-card border-border shadow-xl">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-foreground">
                        Your Hiring Team is Complete! 🎯
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        You&apos;ve selected {candidates.length} diverse
                        candidates for your team
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center"
                >
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  </div>
                </motion.div>

                {/* Candidate List Preview */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Your Hiring Team:
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {candidates.map((candidate, index) => (
                      <motion.div
                        key={candidate.email}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <div className="p-1 bg-primary/10 rounded-full flex-shrink-0">
                            <Users className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {candidate.name ||
                              candidate.email ||
                              "Unknown Candidate"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {candidate.location || candidate.email || "Unknown"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Email Form */}
                {!isEmailSent && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onSubmit={handleEmailSubmit}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Share your hiring team report:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                          required
                        />
                        <Button
                          type="submit"
                          disabled={isLoading || !email || !isValidEmail(email)}
                          className="flex items-center justify-center space-x-2"
                        >
                          {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          <span>Open Email</span>
                        </Button>
                      </div>
                    </div>
                  </motion.form>
                )}

                {/* Success Message */}
                {isEmailSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-2"
                  >
                    <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto" />
                    <p className="text-sm text-foreground">
                      Hiring team report ready!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your diverse team selection is ready to share.
                    </p>
                  </motion.div>
                )}

                {/* PDF Export Option */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handlePDFExport}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download Hiring Report</span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
