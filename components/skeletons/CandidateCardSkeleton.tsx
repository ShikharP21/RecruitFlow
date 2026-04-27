"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useResponsive } from "@/lib/hooks/useResponsive";

export const CandidateCardSkeleton = () => {
  const { isMobile, getCardHeights } = useResponsive();
  const cardHeight = getCardHeights().collapsed;

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
          className={`bg-card border-border ${cardHeight} flex flex-col mx-2`}
        >
          <CardHeader className="pb-2 flex-shrink-0 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 min-w-0 flex-1">
                {/* Name */}
                <div className="h-5 w-24 bg-[#2a2a2a] rounded animate-pulse" />
                {/* Email */}
                <div className="h-4 w-32 bg-[#2a2a2a] rounded animate-pulse" />
              </div>
              {/* Add/Remove Button */}
              <div className="h-8 w-8 bg-[#2a2a2a] rounded animate-pulse flex-shrink-0" />
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-1 flex flex-col min-h-0">
            {/* Main Content Area - Single Row Layout */}
            <div className="flex flex-col h-full">
              {/* Always Visible Info - Single Row Layout */}
              <div className="flex gap-4 flex-shrink-0">
                {/* Left Side - Basic Info */}
                <div className="w-32 space-y-3">
                  {/* Location and Availability */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 bg-[#2a2a2a] rounded animate-pulse flex-shrink-0" />
                      <div className="h-3 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-3 w-3 bg-[#2a2a2a] rounded animate-pulse flex-shrink-0" />
                      <div className="h-3 w-20 bg-[#2a2a2a] rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                  </div>

                  {/* Application Date */}
                  <div className="h-3 w-24 bg-[#2a2a2a] rounded animate-pulse" />
                </div>

                {/* Right Side - Skills */}
                <div className="flex-1 flex flex-col relative">
                  {/* Skills Section */}
                  <div className="space-y-2 pr-8">
                    <div className="h-4 w-12 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="flex flex-wrap gap-1">
                      <div className="h-5 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                      <div className="h-5 w-20 bg-[#2a2a2a] rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Expand Button */}
                  <div className="absolute bottom-0 right-0">
                    <div className="h-8 w-8 bg-[#2a2a2a] rounded animate-pulse" />
                  </div>
                </div>
              </div>
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
      <Card className="bg-card border-border h-[240px] flex flex-col mx-5">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2 min-w-0 flex-1">
              {/* Name */}
              <div className="h-5 w-32 bg-[#2a2a2a] rounded animate-pulse" />
              {/* Email */}
              <div className="h-4 w-40 bg-[#2a2a2a] rounded animate-pulse" />
            </div>
            {/* Add/Remove Button */}
            <div className="h-8 w-8 bg-[#2a2a2a] rounded animate-pulse flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          {/* Main Content Area - Two Column Layout */}
          <div className="flex flex-col h-full">
            {/* Always Visible Info - Single Row */}
            <div className="flex gap-4 flex-shrink-0">
              {/* Left Side - Basic Info */}
              <div className="w-64 space-y-3">
                {/* Location and Availability */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="h-3 w-20 bg-[#2a2a2a] rounded animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-3 w-3 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="h-3 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-[#2a2a2a] rounded animate-pulse" />
                  <div className="h-4 w-20 bg-[#2a2a2a] rounded animate-pulse" />
                </div>

                {/* Application Date */}
                <div className="h-3 w-32 bg-[#2a2a2a] rounded animate-pulse" />
              </div>

              {/* Right Side - Skills */}
              <div className="flex-1 flex flex-col relative">
                {/* Skills Section */}
                <div className="space-y-1">
                  <div className="h-4 w-12 bg-[#2a2a2a] rounded animate-pulse" />
                  <div className="flex flex-wrap gap-1">
                    <div className="h-5 w-16 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="h-5 w-20 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="h-5 w-14 bg-[#2a2a2a] rounded animate-pulse" />
                    <div className="h-5 w-18 bg-[#2a2a2a] rounded animate-pulse" />
                  </div>
                </div>

                {/* Expand Icon - Absolutely Positioned Bottom Right */}
                <div className="absolute bottom-0 right-0">
                  <div className="h-8 w-8 bg-[#2a2a2a] rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
