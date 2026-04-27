"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  MapPin,
  Minus,
  Plus,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Candidate } from "@/lib/types";
import clsx from "clsx";
import { Toast } from "@/lib/toast";
import { useResponsive } from "@/lib/hooks/useResponsive";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const [localExpanded, setLocalExpanded] = useState(false); // For desktop hover
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    addCandidate,
    removeCandidate,
    shortlistedCandidates,
    isFilterApplied,
    expandedCardId,
    setExpandedCard,
  } = useAppStore();

  // Use our responsive hook
  const {
    isMobile,
    getSkillLimit,
    getCardHeights,
    getSkillTruncationLength,
  } = useResponsive();

  const isShortlisted = shortlistedCandidates.some(
    (c) => c.email === candidate.email
  );
  const isMaxReached = shortlistedCandidates.length >= 5;

  // Use global expanded state for mobile, local state for desktop
  const isExpanded = isMobile
    ? expandedCardId === candidate.email
    : localExpanded; // Desktop uses local state for hover

  // Truncate long skill names
  const truncateSkill = (skill: string) => {
    const maxLength = getSkillTruncationLength();
    if (skill.length <= maxLength) return skill;
    return skill.substring(0, maxLength) + "...";
  };

  const handleAddToShortlist = async () => {
    if (isMaxReached && !isShortlisted) {
      Toast.error(
        "Maximum 5 candidates allowed",
        "Please remove a candidate from your shortlist to add a new one."
      );
      return;
    }

    if (isShortlisted) {
      Toast.loading(
        "Candidate already in shortlist",
        `${candidate.name} is already in your shortlist.`
      );
      return;
    }

    try {
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          candidateEmail: candidate.email,
          candidateData: candidate,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        Toast.error(
          "Login required",
          "Please sign in as a recruiter to shortlist candidates."
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        Toast.error(
          "Failed to add to shortlist",
          data.error || "Please try again."
        );
        return;
      }

      const data = await res.json().catch(() => ({}));
      addCandidate(data.candidate || candidate);
      Toast.success(
        "Candidate added to shortlist",
        `${candidate.name} has been added to your shortlist.`
      );
    } catch {
      Toast.error("Network error", "Please check your connection and retry.");
    }
  };

  const handleRemoveFromShortlist = async () => {
    if (!candidate.id) {
      removeCandidate(candidate.email);
      return;
    }

    try {
      const res = await fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: candidate.id }),
      });

      if (!res.ok && res.status !== 404) {
        const data = await res.json().catch(() => ({}));
        Toast.error(
          "Failed to remove",
          data.error || "Please try again."
        );
        return;
      }

      removeCandidate(candidate.email);
      Toast.remove(
        "Candidate removed",
        `${candidate.name} has been removed from your shortlist.`
      );
    } catch {
      Toast.error("Network error", "Please check your connection and retry.");
    }
  };

  // Mobile card expansion handler
  const handleMobileExpand = () => {
    if (isExpanded) {
      setExpandedCard(null); // Close this card
    } else {
      setExpandedCard(candidate.email); // Open this card (closes others)
    }
  };

  // Desktop click handler for expand button
  const handleDesktopExpand = () => {
    setLocalExpanded(!localExpanded);
  };

  const formatSalary = (salary: number) => {
    if (!salary || isNaN(salary)) {
      return "$0";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  // Helper function to handle empty values
  const getValueOrDash = (
    value: string | null | undefined | string[],
    fallback: string = "-"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }
    return value;
  };

  // Improved hover handlers with timeout to prevent glitches (desktop only)
  const handleMouseEnter = () => {
    if (isMobile) return; // Disable hover on mobile
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setLocalExpanded(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    const timeout = setTimeout(() => {
      setLocalExpanded(false);
    }, 150); // Increased delay to prevent glitches when scrolled
    setHoverTimeout(timeout);
  };

  // Force close expanded state when component loses focus or scrolls
  const handleCardBlur = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setLocalExpanded(false);
  };

  // Cleanup timeout on unmount and handle scroll events
  useEffect(() => {
    const closeExpanded = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setLocalExpanded(false);
    };

    const handleScroll = () => {
      if (isExpanded && !isMobile) {
        closeExpanded();
      }
    };

    // Add scroll listener to parent scrollable container
    const scrollContainer = document.querySelector(".scrollbar-hide");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hoverTimeout, isExpanded, isMobile]);

  const cardHeights = getCardHeights();

  // Mobile version
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full p-2"
      >
        <Card
          className={clsx(
            "bg-card border-border transition-all duration-300 mx-2 flex flex-col cursor-pointer",
            {
              [cardHeights.expanded]: isExpanded,
              [cardHeights.collapsed]: !isExpanded,
              "border-primary": isShortlisted,
            }
          )}
          onClick={handleMobileExpand}
        >
          <CardHeader className="flex-shrink-0 p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {getValueOrDash(candidate.name, "Unknown Name")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {getValueOrDash(candidate.email, "No Email")}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Match Score - Only show when filters are applied */}
                {isFilterApplied && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary text-xs"
                  >
                    {candidate.matchScore || 0}%
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant={isShortlisted ? "destructive" : "default"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isShortlisted) {
                      handleRemoveFromShortlist();
                    } else {
                      handleAddToShortlist();
                    }
                  }}
                  disabled={!isShortlisted && isMaxReached}
                  className={clsx("flex-shrink-0 h-8 w-8", {
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90":
                      isShortlisted,
                    "bg-muted text-muted-foreground cursor-not-allowed":
                      !isShortlisted && isMaxReached,
                    "bg-primary text-primary-foreground hover:bg-primary/90":
                      !isShortlisted && !isMaxReached,
                  })}
                  title={
                    isShortlisted
                      ? "Remove from shortlist"
                      : isMaxReached
                      ? "Maximum 5 candidates reached"
                      : "Add to shortlist"
                  }
                >
                  {isShortlisted ? (
                    <Minus className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-1 flex flex-col min-h-0">
            {/* Main Content Area */}
            <div className="flex flex-col h-full">
              {/* Always Visible Info - Single Row Layout (like desktop) */}
              <div className="flex gap-4 flex-shrink-0 mb-3">
                {/* Left Side - Basic Info */}
                <div className="w-32 space-y-3">
                  {/* Location and Availability */}
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {getValueOrDash(candidate.location, "Unknown")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate text-xs">
                        {candidate.work_availability &&
                        candidate.work_availability.length > 0
                          ? candidate.work_availability.join(", ")
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {formatSalary(candidate.salaryNumeric || 0)}
                    </span>
                  </div>

                  {/* Application Date */}
                  <div className="text-xs text-muted-foreground">
                    Applied {formatDate(candidate.submitted_at || "")}
                  </div>
                </div>

                {/* Right Side - Skills */}
                <div className="flex-1 flex flex-col relative">
                  {/* Skills Section */}
                  <div className="space-y-2 pr-8">
                    <span className="text-sm font-medium text-foreground">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills && candidate.skills.length > 0 ? (
                        <>
                          {candidate.skills
                            .slice(0, getSkillLimit())
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {truncateSkill(
                                  String(getValueOrDash(skill, "Unknown Skill"))
                                )}
                              </Badge>
                            ))}
                          {candidate.skills.length > getSkillLimit() && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - getSkillLimit()}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand Icon - Absolutely Positioned Bottom Right */}
                  <div className="absolute bottom-0 right-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobileExpand();
                      }}
                      className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                      title={isExpanded ? "Show less" : "Show more"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Expandable Content - Experience and Education in Row */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 min-h-0 py-3 overflow-hidden"
                  >
                    <div className="flex gap-3 h-full">
                      {/* Experience Column */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            Experience
                          </span>
                        </div>
                        <div className="pl-4 space-y-1">
                          {candidate.work_experiences
                            ?.slice(0, 2)
                            .map((exp, index) => (
                              <div
                                key={index}
                                className="text-xs text-muted-foreground leading-tight"
                              >
                                <span className="font-medium">
                                  {String(
                                    getValueOrDash(exp.roleName, "Unknown Role")
                                  ).length > 20
                                    ? String(
                                        getValueOrDash(
                                          exp.roleName,
                                          "Unknown Role"
                                        )
                                      ).substring(0, 20) + "..."
                                    : getValueOrDash(
                                        exp.roleName,
                                        "Unknown Role"
                                      )}
                                </span>
                                <br />
                                <span className="text-xs opacity-75">
                                  at{" "}
                                  {String(
                                    getValueOrDash(
                                      exp.company,
                                      "Unknown Company"
                                    )
                                  ).length > 25
                                    ? String(
                                        getValueOrDash(
                                          exp.company,
                                          "Unknown Company"
                                        )
                                      ).substring(0, 25) + "..."
                                    : getValueOrDash(
                                        exp.company,
                                        "Unknown Company"
                                      )}
                                </span>
                              </div>
                            ))}
                          {candidate.work_experiences &&
                            candidate.work_experiences.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{candidate.work_experiences.length - 2} more
                              </div>
                            )}
                          {(!candidate.work_experiences ||
                            candidate.work_experiences.length === 0) && (
                            <div className="text-xs text-muted-foreground">
                              No experience listed
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Education Column */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            Education
                          </span>
                          {candidate.isTopSchool && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              Top
                            </Badge>
                          )}
                        </div>
                        <div className="pl-4 space-y-1">
                          {candidate.education?.degrees
                            ?.slice(0, 2)
                            .map((degree, index) => (
                              <div
                                key={index}
                                className="text-xs text-muted-foreground leading-tight"
                              >
                                <span className="font-medium">
                                  {String(
                                    getValueOrDash(
                                      degree.degree,
                                      "Unknown Degree"
                                    )
                                  ).length > 18
                                    ? String(
                                        getValueOrDash(
                                          degree.degree,
                                          "Unknown Degree"
                                        )
                                      ).substring(0, 18) + "..."
                                    : getValueOrDash(
                                        degree.degree,
                                        "Unknown Degree"
                                      )}
                                </span>
                                <br />
                                <span className="text-xs opacity-75">
                                  in{" "}
                                  {String(
                                    getValueOrDash(
                                      degree.subject,
                                      "Unknown Subject"
                                    )
                                  ).length > 20
                                    ? String(
                                        getValueOrDash(
                                          degree.subject,
                                          "Unknown Subject"
                                        )
                                      ).substring(0, 20) + "..."
                                    : getValueOrDash(
                                        degree.subject,
                                        "Unknown Subject"
                                      )}
                                </span>
                              </div>
                            ))}
                          {(!candidate.education?.degrees ||
                            candidate.education.degrees.length === 0) && (
                            <div className="text-xs text-muted-foreground">
                              No education listed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Desktop version (original)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-2"
    >
      <Card
        className={clsx(
          "bg-card border-border transition-all duration-300 mx-5 flex flex-col cursor-pointer",
          {
            [cardHeights.expanded]: isExpanded,
            [cardHeights.collapsed]: !isExpanded,
            "border-primary": isShortlisted,
            "hover:border-border/80": !isShortlisted,
          }
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onBlur={handleCardBlur}
      >
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {getValueOrDash(candidate.name, "Unknown Name")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {getValueOrDash(candidate.email, "No Email")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Match Score - Only show when filters are applied */}
              {isFilterApplied && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    Match
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary"
                  >
                    {candidate.matchScore || 0}%
                  </Badge>
                </div>
              )}
              <Button
                size="sm"
                variant={isShortlisted ? "destructive" : "default"}
                onClick={
                  isShortlisted
                    ? handleRemoveFromShortlist
                    : handleAddToShortlist
                }
                disabled={!isShortlisted && isMaxReached}
                className={clsx("flex-shrink-0", {
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90":
                    isShortlisted,
                  "bg-muted text-muted-foreground cursor-not-allowed":
                    !isShortlisted && isMaxReached,
                  "bg-primary text-primary-foreground hover:bg-primary/90":
                    !isShortlisted && !isMaxReached,
                })}
                title={
                  isShortlisted
                    ? "Remove from shortlist"
                    : isMaxReached
                    ? "Maximum 5 candidates reached"
                    : "Add to shortlist"
                }
              >
                {isShortlisted ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            {/* Always Visible Info - Single Row */}
            <div className="flex gap-4 flex-shrink-0">
              {/* Left Side - Basic Info */}
              <div className="w-64 space-y-3">
                {/* Location and Availability */}
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-20">
                      {getValueOrDash(candidate.location, "Unknown")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-3 w-3" />
                    <span className="truncate">
                      {candidate.work_availability &&
                      candidate.work_availability.length > 0
                        ? candidate.work_availability.join(", ")
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {formatSalary(candidate.salaryNumeric || 0)}
                  </span>
                </div>

                {/* Application Date */}
                <div className="text-xs text-muted-foreground">
                  Applied {formatDate(candidate.submitted_at || "")}
                </div>
              </div>

              {/* Right Side - Skills */}
              <div className="flex-1 flex flex-col relative">
                {/* Skills Section */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      <>
                        {candidate.skills
                          ?.slice(0, getSkillLimit())
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {truncateSkill(
                                String(getValueOrDash(skill, "Unknown Skill"))
                              )}
                            </Badge>
                          ))}
                        {candidate.skills &&
                          candidate.skills.length > getSkillLimit() && (
                            <Badge variant="outline" className="text-xs">
                              +{candidate.skills.length - getSkillLimit()}
                            </Badge>
                          )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Icon - Absolutely Positioned Bottom Right */}
                <div className="absolute bottom-0 right-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDesktopExpand}
                    className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                    title={isExpanded ? "Show less" : "Show more"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Expandable Content - Experience and Education in Row */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-h-0 py-4 overflow-hidden"
                >
                  <div className="flex gap-6 h-full">
                    {/* Experience Column */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Experience
                        </span>
                      </div>
                      <div className="pl-5 space-y-1">
                        {candidate.work_experiences
                          ?.slice(0, 3)
                          .map((exp, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              <span className="font-medium">
                                {String(
                                  getValueOrDash(exp.roleName, "Unknown Role")
                                ).length > 25
                                  ? String(
                                      getValueOrDash(
                                        exp.roleName,
                                        "Unknown Role"
                                      )
                                    ).substring(0, 25) + "..."
                                  : getValueOrDash(
                                      exp.roleName,
                                      "Unknown Role"
                                    )}
                              </span>{" "}
                              at{" "}
                              {String(
                                getValueOrDash(exp.company, "Unknown Company")
                              ).length > 30
                                ? String(
                                    getValueOrDash(
                                      exp.company,
                                      "Unknown Company"
                                    )
                                  ).substring(0, 30) + "..."
                                : getValueOrDash(
                                    exp.company,
                                    "Unknown Company"
                                  )}
                            </div>
                          ))}
                        {candidate.work_experiences &&
                          candidate.work_experiences.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{candidate.work_experiences.length - 3} more
                            </div>
                          )}
                        {(!candidate.work_experiences ||
                          candidate.work_experiences.length === 0) && (
                          <div className="text-xs text-muted-foreground">
                            No experience listed
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Column */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Education
                        </span>
                        {candidate.isTopSchool && (
                          <Badge variant="outline" className="text-xs">
                            Top School
                          </Badge>
                        )}
                      </div>
                      <div className="pl-5 space-y-1">
                        {candidate.education?.degrees
                          ?.slice(0, 2)
                          .map((degree, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              {String(
                                getValueOrDash(degree.degree, "Unknown Degree")
                              ).length > 22
                                ? String(
                                    getValueOrDash(
                                      degree.degree,
                                      "Unknown Degree"
                                    )
                                  ).substring(0, 22) + "..."
                                : getValueOrDash(
                                    degree.degree,
                                    "Unknown Degree"
                                  )}{" "}
                              in{" "}
                              {String(
                                getValueOrDash(
                                  degree.subject,
                                  "Unknown Subject"
                                )
                              ).length > 25
                                ? String(
                                    getValueOrDash(
                                      degree.subject,
                                      "Unknown Subject"
                                    )
                                  ).substring(0, 25) + "..."
                                : getValueOrDash(
                                    degree.subject,
                                    "Unknown Subject"
                                  )}
                            </div>
                          ))}
                        {(!candidate.education?.degrees ||
                          candidate.education.degrees.length === 0) && (
                          <div className="text-xs text-muted-foreground">
                            No education listed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
