"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import FilterPanelSkeleton from "@/components/skeletons/FilterPanelSkeleton";
import ShortlistPanelSkeleton from "@/components/skeletons/ShortlistPanelSkeleton";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CandidateGrid } from "@/components/dashboard/CandidateGrid";
import { ShortlistPanel } from "@/components/dashboard/ShortlistPanel";
import { TeamSelectionModal } from "@/components/dashboard/TeamSelectionModal";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const Home = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    shortlistedCandidates,
    showTeamModal,
    closeTeamModal,
    openTeamModal,
    isLeftPanelExpanded,
    isRightPanelExpanded,
    toggleLeftPanel,
    toggleRightPanel,
    setLeftPanelExpanded,
    setRightPanelExpanded,
    setShortlist,
  } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (user?.role !== "recruiter") {
      router.replace("/candidate");
    }
  }, [isAuthenticated, user?.role, router]);

  // Initialize panel states after hydration (SSR-safe)
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      setLeftPanelExpanded(true);
      setRightPanelExpanded(true);
    }
  }, [setLeftPanelExpanded, setRightPanelExpanded]);

  // Hydrate shortlist from DB for authenticated recruiters
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "recruiter") return;
    let cancelled = false;
    fetch("/api/shortlist")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.candidates) return;
        setShortlist(data.candidates);
      })
      .catch(() => {
        /* silent — local shortlist remains */
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.role, setShortlist]);

  // Auto-open modal when 5 candidates are selected
  useEffect(() => {
    if (shortlistedCandidates.length === 5) {
      openTeamModal();
    }
  }, [shortlistedCandidates.length, openTeamModal]);

  if (!isAuthenticated || user?.role !== "recruiter") {
    return null;
  }

  return (
    <div className="min-h-screen h-dvh bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex w-full relative">
          {/* Desktop: Filter Panel - Expandable Sidebar */}
          <AnimatePresence>
            {isLeftPanelExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex flex-shrink-0 border-r border-border bg-card overflow-hidden relative"
              >
                <div
                  className="h-full overflow-y-auto p-6 scrollbar-hide"
                  style={{ width: "320px" }}
                >
                  <Suspense fallback={<FilterPanelSkeleton />}>
                    <FilterPanel />
                  </Suspense>
                </div>

                {/* Close button for left panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center absolute top-2 -right-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-bl-md rounded-tl-md border-r-0"
                  onClick={toggleLeftPanel}
                >
                  <button
                    className="hover:text-foreground/50 transition-colors duration-200"
                    aria-label="Close left panel"
                  >
                    <ChevronLeft className="w-2 h-2" strokeWidth={5} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop: Open button for left panel when collapsed */}
          <AnimatePresence>
            {!isLeftPanelExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="hidden lg:flex items-center justify-center absolute top-2 left-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-br-md rounded-tr-md border-l-0"
                onClick={toggleLeftPanel}
              >
                <button
                  className="hover:text-foreground/50 transition-colors duration-200"
                  aria-label="Open left panel"
                >
                  <ChevronRight className="w-2 h-2" strokeWidth={5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidate Grid - Dynamic width */}
          <motion.div
            className="flex-1 min-w-0"
            animate={{
              marginLeft: isLeftPanelExpanded ? 0 : 0,
              marginRight: isRightPanelExpanded ? 0 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CandidateGrid />
          </motion.div>

          {/* Desktop: Open button for right panel when collapsed */}
          <AnimatePresence>
            {!isRightPanelExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="hidden lg:flex items-center justify-center absolute top-2 right-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-bl-md rounded-tl-md border-r-0"
                onClick={toggleRightPanel}
              >
                <button
                  className="hover:text-foreground/50 transition-colors duration-200"
                  aria-label="Open right panel"
                >
                  <ChevronLeft className="w-2 h-2" strokeWidth={5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop: Shortlist Panel - Expandable Sidebar */}
          <AnimatePresence>
            {isRightPanelExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex flex-shrink-0 border-l border-border bg-card overflow-hidden relative"
              >
                <div
                  className="h-full overflow-y-auto p-6 scrollbar-hide"
                  style={{ width: "320px" }}
                >
                  <Suspense fallback={<ShortlistPanelSkeleton />}>
                    <ShortlistPanel />
                  </Suspense>
                </div>

                {/* Close button for right panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center absolute top-2 -left-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-br-md rounded-tr-md border-l-0"
                  onClick={toggleRightPanel}
                >
                  <button
                    className="hover:text-foreground/50 transition-colors duration-200"
                    aria-label="Close right panel"
                  >
                    <ChevronRight className="w-2 h-2" strokeWidth={5} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile/Tablet: Bottom Sheet for Filter Panel */}
      <AnimatePresence>
        {isLeftPanelExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleLeftPanel}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Panel content */}
              <div
                className="h-full overflow-y-auto scrollbar-hide"
                style={{ maxHeight: "calc(85vh - 60px)" }}
              >
                <div className="p-4">
                  <Suspense fallback={<FilterPanelSkeleton />}>
                    <FilterPanel />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet: Bottom Sheet for Shortlist Panel */}
      <AnimatePresence>
        {isRightPanelExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleRightPanel}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Panel content */}
              <div
                className="h-full overflow-y-auto scrollbar-hide"
                style={{ maxHeight: "calc(85vh - 60px)" }}
              >
                <div className="p-4">
                  <Suspense fallback={<ShortlistPanelSkeleton />}>
                    <ShortlistPanel />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile/Tablet: Floating Action Buttons */}
      <div
        className="lg:hidden fixed bottom-4 left-4 right-4 flex justify-between z-30"
        style={{ bottom: "env(safe-area-inset-bottom, 1rem)" }}
      >
        {/* Filter Button */}
        <Button
          size="lg"
          variant="default"
          onClick={toggleLeftPanel}
          className="flex items-center space-x-2 shadow-lg"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>

        {/* Shortlist Button */}
        <Button
          size="lg"
          variant="outline"
          onClick={toggleRightPanel}
          className="flex items-center space-x-2 shadow-lg"
        >
          <Users className="h-4 w-4" />
          <span>Shortlist ({shortlistedCandidates.length}/5)</span>
        </Button>
      </div>

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={showTeamModal}
        onClose={closeTeamModal}
        candidates={shortlistedCandidates}
      />
    </div>
  );
};

export default Home;
