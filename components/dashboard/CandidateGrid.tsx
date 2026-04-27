"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "./CandidateCard";
import { CandidateCardSkeleton } from "@/components/skeletons/CandidateCardSkeleton";
import { useAppStore } from "@/lib/store";
import { Candidate } from "@/lib/types";
import clsx from "clsx";
import { Toast } from "@/lib/toast";

export const CandidateGrid = () => {
  const { filters } = useAppStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize for responsive pagination
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Set initial value
    checkIsMobile();

    // Add event listener
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const fetchCandidates = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setLoadingPage(true);
        }
        setError(null);

        const queryParams = new URLSearchParams({
          skills: filters.skills,
          workAvailability: filters.workAvailability.join(","),
          minSalary: filters.minSalary.toString(),
          maxSalary: filters.maxSalary.toString(),
          location: filters.location,
          roleName: filters.roleName,
          company: filters.company,
          educationLevel: filters.educationLevel,
          degreeSubject: filters.degreeSubject,
          sortBy: filters.sortBy,
          page: pageNum.toString(),
          limit: "10", // Show 10 candidates per page
        });

        const response = await fetch(`/api/candidates?${queryParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();

        setCandidates(data.candidates);
        setTotal(data.total);
        setCurrentPage(pageNum);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        Toast.error(
          "Failed to load candidates",
          "Please try again or check your connection."
        );
      } finally {
        setLoading(false);
        setLoadingPage(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setLoading(true); // Set loading immediately when filters change
    setCurrentPage(1);
    setCandidates([]);
    setTotal(0);
    setTotalPages(1);
    fetchCandidates(1, true);
  }, [filters, fetchCandidates]);

  const handleRetry = () => {
    fetchCandidates(1, true);
  };

  const handleRefresh = () => {
    fetchCandidates(1, true);
    Toast.loading(
      "Refreshing candidates",
      "Loading the latest candidate data..."
    );
  };

  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.skills) {
      activeFilters.push({
        key: "skills",
        label: `Skills: ${filters.skills}`,
        value: filters.skills,
      });
    }

    if (filters.workAvailability.length > 0) {
      activeFilters.push({
        key: "workAvailability",
        label: `Availability: ${filters.workAvailability.join(", ")}`,
        value: filters.workAvailability,
      });
    }

    if (filters.location) {
      activeFilters.push({
        key: "location",
        label: `Location: ${filters.location}`,
        value: filters.location,
      });
    }

    if (filters.roleName) {
      activeFilters.push({
        key: "roleName",
        label: `Role: ${filters.roleName}`,
        value: filters.roleName,
      });
    }

    if (filters.company) {
      activeFilters.push({
        key: "company",
        label: `Company: ${filters.company}`,
        value: filters.company,
      });
    }

    if (filters.educationLevel && filters.educationLevel !== "all") {
      activeFilters.push({
        key: "educationLevel",
        label: `Education: ${filters.educationLevel}`,
        value: filters.educationLevel,
      });
    }

    if (filters.degreeSubject) {
      activeFilters.push({
        key: "degreeSubject",
        label: `Degree: ${filters.degreeSubject}`,
        value: filters.degreeSubject,
      });
    }

    if (filters.minSalary > 45000 || filters.maxSalary < 150000) {
      activeFilters.push({
        key: "salary",
        label: `Salary: $${filters.minSalary.toLocaleString()}-$${filters.maxSalary.toLocaleString()}`,
        value: { min: filters.minSalary, max: filters.maxSalary },
      });
    }

    return activeFilters;
  };

  const handleRemoveFilter = (filterKey: string) => {
    const { setFilters } = useAppStore.getState();

    switch (filterKey) {
      case "skills":
        setFilters({ skills: "" });
        break;
      case "workAvailability":
        setFilters({ workAvailability: [] });
        break;
      case "location":
        setFilters({ location: "" });
        break;
      case "roleName":
        setFilters({ roleName: "" });
        break;
      case "company":
        setFilters({ company: "" });
        break;
      case "educationLevel":
        setFilters({ educationLevel: "all" });
        break;
      case "degreeSubject":
        setFilters({ degreeSubject: "" });
        break;
      case "salary":
        setFilters({ minSalary: 45000, maxSalary: 150000 });
        break;
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 space-y-4"
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Failed to load candidates
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 pt-6 pb-4">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-4 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center space-x-2 min-w-0">
              <Users className="h-5 w-5 text-primary flex-shrink-0" />
              <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {getActiveFilters().length > 0
                  ? "Filtered Candidates"
                  : "All Candidates"}
              </h2>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-1">
              {total > 0 && (
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  ({candidates.length} of {total} shown)
                </span>
              )}
              {getActiveFilters().length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                  Filter Applied
                </span>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto flex-shrink-0"
          >
            <RefreshCw
              className={clsx("h-4 w-4 mr-2", {
                "animate-spin": loading,
              })}
            />
            Refresh
          </Button>
        </div>

        {/* Active Filter Tags */}
        {getActiveFilters().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 px-4 sm:px-5"
          >
            {getActiveFilters().map((filter) => (
              <motion.div
                key={filter.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center space-x-1 bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-primary/20 max-w-full"
              >
                <span className="text-xs truncate max-w-32 sm:max-w-none">
                  {filter.label}
                </span>
                <button
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors flex-shrink-0"
                  title={`Remove ${filter.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 scrollbar-hide px-2 sm:px-5">
        {/* Show shimmer during any loading state */}
        {(loading || loadingPage) && (
          <>
            {[...Array(6)].map((_, index) => (
              <CandidateCardSkeleton key={`loading-${index}`} />
            ))}
          </>
        )}

        {/* Show candidates when not loading */}
        {candidates.length > 0 && !loading && !loadingPage && (
          <AnimatePresence mode="wait">
            {candidates.map((candidate, index) => (
              <motion.div
                key={`${candidate.name}-${candidate.email}-${candidate.phone}-${currentPage}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CandidateCard candidate={candidate} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* No Results State */}
        {candidates.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No candidates found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        )}

        {/* Add bottom padding when no pagination to prevent overlap with floating buttons */}
        {totalPages <= 1 && candidates.length > 0 && (
          <div className="h-20 lg:hidden" />
        )}
      </div>

      {/* Fixed Bottom Pagination */}
      {totalPages > 1 && candidates.length > 0 && (
        <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 sm:pt-5 px-4 sm:px-6 pb-16 lg:pb-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Page {currentPage} of {totalPages} • {total} total candidates
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCandidates(currentPage - 1)}
                disabled={currentPage === 1 || loadingPage}
                className="flex items-center space-x-1 text-xs h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
              >
                <span>←</span>
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center space-x-1">
                {(() => {
                  const maxVisible = isMobile ? 3 : 5;
                  let startPage = 1;
                  let endPage = Math.min(maxVisible, totalPages);

                  // If we're past the first few pages, show a window around current page
                  if (currentPage > 3) {
                    startPage = Math.max(1, currentPage - 2);
                    endPage = Math.min(totalPages, currentPage + 2);
                  }

                  // If we're near the end, adjust to show the last few pages
                  if (endPage === totalPages && totalPages > maxVisible) {
                    startPage = Math.max(1, totalPages - maxVisible + 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  return (
                    <>
                      {startPage > 1 && !isMobile && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCandidates(1)}
                            disabled={loadingPage}
                            className="w-8 h-8 p-0 text-xs"
                          >
                            1
                          </Button>
                          {startPage > 2 && (
                            <span className="text-muted-foreground px-1 sm:px-2 text-xs">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {pages.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => fetchCandidates(pageNum)}
                          disabled={loadingPage}
                          className="w-8 h-8 p-0 text-xs"
                        >
                          {pageNum}
                        </Button>
                      ))}

                      {endPage < totalPages && !isMobile && (
                        <>
                          {endPage < totalPages - 1 && (
                            <span className="text-muted-foreground px-1 sm:px-2 text-xs">
                              ...
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCandidates(totalPages)}
                            disabled={loadingPage}
                            className="w-8 h-8 p-0 text-xs"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCandidates(currentPage + 1)}
                disabled={currentPage === totalPages || loadingPage}
                className="flex items-center space-x-1 text-xs h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
              >
                <span className="hidden sm:inline">Next</span>
                <span>→</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Show candidate count when no pagination */}
      {totalPages <= 1 && candidates.length > 0 && (
        <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 sm:pt-5 px-4 sm:px-6 pb-16 lg:pb-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              {total} total candidates
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
