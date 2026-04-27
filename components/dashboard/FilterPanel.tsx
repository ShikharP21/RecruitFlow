"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { Toast } from "@/lib/toast";
import { Checkbox } from "../ui/checkbox";
import { useResponsive } from "@/lib/hooks/useResponsive";

export const FilterPanel = () => {
  const {
    filters,
    setFilters,
    applyFilters: applyStoreFilters,
    clearFilters: clearStoreFilters,
    isFilterApplied,
    setLeftPanelExpanded,
  } = useAppStore();

  const { isMobile } = useResponsive();

  const [localFilters, setLocalFilters] = useState(filters);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
    setHasLocalChanges(false);
  }, [filters]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | number | boolean | string[]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    // Check if local filters differ from applied filters
    const hasChanges =
      newFilters.skills !== filters.skills ||
      JSON.stringify(newFilters.workAvailability) !==
        JSON.stringify(filters.workAvailability) ||
      newFilters.minSalary !== filters.minSalary ||
      newFilters.maxSalary !== filters.maxSalary ||
      newFilters.location !== filters.location ||
      newFilters.roleName !== filters.roleName ||
      newFilters.company !== filters.company ||
      newFilters.educationLevel !== filters.educationLevel ||
      newFilters.degreeSubject !== filters.degreeSubject ||
      newFilters.sortBy !== filters.sortBy;

    setHasLocalChanges(hasChanges);
  };

  const handleWorkAvailabilityChange = (
    availability: string,
    checked: boolean
  ) => {
    const current = localFilters.workAvailability;
    const newAvailability = checked
      ? [...current, availability]
      : current.filter((a) => a !== availability);
    handleFilterChange("workAvailability", newAvailability);
  };

  const applyFilters = () => {
    setFilters(localFilters);
    applyStoreFilters();
    setHasLocalChanges(false);

    // Show toast with filter summary
    const activeFilters = [];
    if (localFilters.skills)
      activeFilters.push(`Skills: ${localFilters.skills}`);
    if (localFilters.workAvailability.length > 0)
      activeFilters.push(
        `Availability: ${localFilters.workAvailability.join(", ")}`
      );
    if (localFilters.location)
      activeFilters.push(`Location: ${localFilters.location}`);
    if (localFilters.roleName)
      activeFilters.push(`Role: ${localFilters.roleName}`);
    if (localFilters.company)
      activeFilters.push(`Company: ${localFilters.company}`);
    if (localFilters.educationLevel)
      activeFilters.push(`Education: ${localFilters.educationLevel}`);
    if (localFilters.degreeSubject)
      activeFilters.push(`Degree: ${localFilters.degreeSubject}`);
    if (localFilters.minSalary > 45000 || localFilters.maxSalary < 150000) {
      activeFilters.push(
        `Salary: $${localFilters.minSalary.toLocaleString()}-$${localFilters.maxSalary.toLocaleString()}`
      );
    }

    const filterCount = activeFilters.length;
    if (filterCount > 0) {
      Toast.success(
        "Filters applied",
        `${filterCount} filter${
          filterCount > 1 ? "s" : ""
        } applied: ${activeFilters.slice(0, 2).join(", ")}${
          filterCount > 2 ? "..." : ""
        }`
      );
    } else {
      Toast.loading(
        "All filters cleared",
        "Showing all candidates without filters."
      );
    }

    // Close filter panel on mobile after applying filters
    if (isMobile) {
      setLeftPanelExpanded(false);
    }
  };

  const resetFilters = () => {
    clearStoreFilters();
    setLocalFilters({
      skills: "",
      workAvailability: [],
      minSalary: 45000,
      maxSalary: 150000,
      location: "",
      roleName: "",
      company: "",
      educationLevel: "all",
      degreeSubject: "",
      sortBy: "date",
      page: 1,
      limit: 10,
    });
    setHasLocalChanges(false);
    Toast.remove("Filters cleared", "Showing all candidates without filters.");

    // Close filter panel on mobile after clearing filters
    if (isMobile) {
      setLeftPanelExpanded(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Filters
        </h2>
        {isFilterApplied && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Skills Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Skills</label>
          <Input
            placeholder="e.g., React, Python, AWS"
            value={localFilters.skills}
            onChange={(e) => handleFilterChange("skills", e.target.value)}
            className="bg-background border-border cursor-text"
          />
        </div>

        {/* Work Availability */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Work Availability
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="full-time"
                checked={localFilters.workAvailability.includes("full-time")}
                onCheckedChange={(checked: boolean) =>
                  handleWorkAvailabilityChange("full-time", checked)
                }
              />
              <label
                htmlFor="full-time"
                className="text-sm text-foreground cursor-pointer"
              >
                Full-time
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="part-time"
                checked={localFilters.workAvailability.includes("part-time")}
                onCheckedChange={(checked: boolean) =>
                  handleWorkAvailabilityChange("part-time", checked)
                }
              />
              <label
                htmlFor="part-time"
                className="text-sm text-foreground cursor-pointer"
              >
                Part-time
              </label>
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Location
          </label>
          <Input
            placeholder="e.g., United States, Canada"
            value={localFilters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="bg-background border-border cursor-text"
          />
        </div>

        {/* Role Name Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Role Name
          </label>
          <Input
            placeholder="e.g., Software Engineer, Developer"
            value={localFilters.roleName}
            onChange={(e) => handleFilterChange("roleName", e.target.value)}
            className="bg-background border-border cursor-text"
          />
        </div>

        {/* Company Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Company</label>
          <Input
            placeholder="e.g., Google, Microsoft"
            value={localFilters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
            className="bg-background border-border cursor-text"
          />
        </div>

        {/* Education and Sort By Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Education
            </label>
            <Select
              value={localFilters.educationLevel}
              onValueChange={(value) =>
                handleFilterChange("educationLevel", value)
              }
            >
              <SelectTrigger className="bg-background border-border cursor-pointer w-full">
                <SelectValue
                  placeholder="Select education level"
                  className="truncate"
                />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
              >
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="High School Diploma">
                  High School Diploma
                </SelectItem>
                <SelectItem value="Bachelor's Degree">
                  Bachelor&apos;s Degree
                </SelectItem>
                <SelectItem value="Master's Degree">
                  Master&apos;s Degree
                </SelectItem>
                <SelectItem value="Doctorate">Doctorate</SelectItem>
                <SelectItem value="Juris Doctor (J.D)">
                  Juris Doctor (J.D)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Sort By
            </label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="bg-background border-border cursor-pointer w-full">
                <SelectValue className="truncate" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
              >
                <SelectItem value="matchScore">Match Score</SelectItem>
                <SelectItem value="date">Date Applied</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="experience">
                  Experience (Job Count)
                </SelectItem>
                <SelectItem value="topSchools">Top Schools</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Degree Subject Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Degree Subject
          </label>
          <Input
            placeholder="e.g., Computer Science, Engineering"
            value={localFilters.degreeSubject}
            onChange={(e) =>
              handleFilterChange("degreeSubject", e.target.value)
            }
            className="bg-background border-border cursor-text"
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Salary Range
          </label>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>${localFilters.minSalary.toLocaleString()}</span>
            <span>${localFilters.maxSalary.toLocaleString()}</span>
          </div>
          <Slider
            value={[localFilters.minSalary, localFilters.maxSalary]}
            onValueChange={(value) => {
              setLocalFilters((prev) => ({
                ...prev,
                minSalary: value[0],
                maxSalary: value[1],
              }));
            }}
            max={150000}
            min={45000}
            step={5000}
            className="w-full"
          />
        </div>
      </div>

      <Button
        onClick={applyFilters}
        disabled={!hasLocalChanges && isFilterApplied}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isFilterApplied ? "Filters Applied" : "Apply Filters"}
      </Button>
    </motion.div>
  );
};
