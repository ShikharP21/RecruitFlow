"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/lib/types";
import {
  Users,
  DollarSign,
  GraduationCap,
  MapPin,
  Target,
} from "lucide-react";
import clsx from "clsx";

interface TeamAnalyticsProps {
  candidates: Candidate[];
  hasFilters?: boolean;
}

export const TeamAnalytics = ({
  candidates,
  hasFilters = false,
}: TeamAnalyticsProps) => {
  if (candidates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <p className="text-muted-foreground">
          Add candidates to see team analytics
        </p>
      </motion.div>
    );
  }

  // Calculate meaningful analytics based on our data structure
  const avgSalary =
    candidates.reduce((sum, c) => sum + (c.salaryNumeric || 0), 0) /
    candidates.length;

  const topSchoolCount = candidates.filter((c) => c.isTopSchool).length;

  const avgMatchScore =
    candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) /
    candidates.length;

  // Essential analytics for recruiters
  const uniqueLocations = new Set(candidates.map((c) => c.location)).size;

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("us-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const stats = [
    {
      title: "Team Size",
      value: candidates.length,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg. Salary",
      value: formatSalary(avgSalary),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Locations",
      value: `${uniqueLocations} cities`,
      icon: MapPin,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Top Schools",
      value: `${topSchoolCount}/${candidates.length}`,
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Team Analytics
          </h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {candidates.length} selected
          </Badge>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-card border-border h-full hover:border-primary/20 transition-colors">
                <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                  <div
                    className={clsx(
                      "p-3 rounded-lg flex-shrink-0 mb-3",
                      stat.bgColor
                    )}
                  >
                    <stat.icon className={clsx("h-5 w-5", stat.color)} />
                  </div>
                  <div className="space-y-1 w-full">
                    <p className="text-xs text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Average Match Score - Only show when filters are applied */}
        {hasFilters && (
          <Card className="bg-card border-border hover:border-primary/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Average Match Score
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {avgMatchScore.toFixed(0)}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {avgMatchScore.toFixed(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Distribution */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Top Skills</h4>
          <div className="space-y-3">
            {getTopSkills(candidates)
              .slice(0, 5)
              .map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground truncate flex-1">
                    {skill.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs ml-2 flex-shrink-0"
                  >
                    {skill.count}
                  </Badge>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const getTopSkills = (candidates: Candidate[]) => {
  const skillCounts: { [key: string]: number } = {};

  candidates.forEach((candidate) => {
    candidate.skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};
