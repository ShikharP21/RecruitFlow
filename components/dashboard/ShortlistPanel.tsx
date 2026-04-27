"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { X, Users, Trash2, MapPin, User } from "lucide-react";
import { Toast } from "@/lib/toast";
import { TeamAnalytics } from "./TeamAnalytics";

export const ShortlistPanel = () => {
  const { shortlistedCandidates, removeCandidate, clearShortlist, filters } =
    useAppStore();

  // Check if any filters are applied
  const hasFilters =
    filters.skills !== "" ||
    filters.workAvailability.length > 0 ||
    filters.minSalary !== 45000 ||
    filters.maxSalary !== 150000 ||
    filters.location !== "" ||
    filters.roleName !== "" ||
    filters.company !== "" ||
    filters.educationLevel !== "all" ||
    filters.degreeSubject !== "";

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const handleRemoveCandidate = async (
    candidateEmail: string,
    candidateName: string
  ) => {
    const target = shortlistedCandidates.find((c) => c.email === candidateEmail);
    if (target?.id) {
      try {
        await fetch("/api/shortlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateId: target.id }),
        });
      } catch {
        /* optimistic: still update local state */
      }
    }
    removeCandidate(candidateEmail);
    Toast.remove(
      "Candidate removed",
      `${candidateName} has been removed from your shortlist.`
    );
  };

  const handleClearShortlist = async () => {
    if (shortlistedCandidates.length === 0) {
      Toast.loading("Shortlist is already empty", "No candidates to remove.");
      return;
    }

    try {
      await fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      /* optimistic: still update local state */
    }
    clearShortlist();
    Toast.remove(
      "Shortlist cleared",
      `All candidates have been removed from your shortlist.`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Shortlist
          </h2>
        </div>
        {shortlistedCandidates.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearShortlist}
            className="text-destructive hover:text-destructive w-full sm:w-auto"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Team Analytics */}
      <TeamAnalytics
        candidates={shortlistedCandidates}
        hasFilters={hasFilters}
      />

      {/* Shortlisted Candidates */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Selected Candidates
          </h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {shortlistedCandidates.length}/5
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          {shortlistedCandidates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 sm:py-8"
            >
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                No candidates selected yet
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Click the + button on candidate cards to add them to your
                shortlist
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence>
                {shortlistedCandidates.map((candidate, index) => (
                  <motion.div
                    key={`${candidate.name}-${candidate.email}-${candidate.phone}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                              <h4 className="font-medium text-foreground truncate text-sm sm:text-base">
                                {candidate.name}
                              </h4>
                              {hasFilters &&
                                candidate.matchScore !== undefined && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-primary/20 text-primary text-xs flex-shrink-0"
                                  >
                                    {candidate.matchScore}%
                                  </Badge>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {candidate.email}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1 truncate">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span>{candidate.location}</span>
                              </div>
                              <span className="flex-shrink-0">
                                {formatSalary(candidate.salaryNumeric || 0)}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveCandidate(
                                candidate.email,
                                candidate.name
                              )
                            }
                            className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                            title="Remove from shortlist"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline ml-1">
                              Remove
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* Max Selection Warning */}
        {shortlistedCandidates.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-3 ${
              shortlistedCandidates.length === 5
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-primary/10 border border-primary/20"
            }`}
          >
            {shortlistedCandidates.length === 5 ? (
              <>
                <p className="text-sm text-green-600 font-medium">
                  🎉 Your dream team is complete!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the Export PDF button in the header to download your team
                  data
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-primary font-medium">
                  Maximum 5 candidates selected
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Remove a candidate to add a new one
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
