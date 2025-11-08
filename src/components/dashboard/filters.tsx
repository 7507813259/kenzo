// components/filter-system.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function FilterSystem() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    date: null as Date | null,
    client: "",
    contractType: ""
  });

  // Generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => (currentYear - i).toString());

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: null,
      client: "",
      contractType: ""
    });
    setSelectedYear("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      {/* Header with Dropdown and Filter Button */}
      <div className="flex items-center gap-4">
        {/* Year Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-between">
              {selectedYear || "Select Year"}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {years.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
                className="cursor-pointer"
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Toggle Button */}
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={handleFilterToggle}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Clear Filters Button */}
        {(selectedYear || filters.date || filters.client || filters.contractType) && (
          <Button variant="ghost" onClick={clearFilters} className="text-sm">
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4 animate-in fade-in-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date ? format(filters.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.date || undefined}
                    onSelect={(date) => handleFilterChange("date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Client Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Client</label>
              <Input
                placeholder="Filter by client..."
                value={filters.client}
                onChange={(e) => handleFilterChange("client", e.target.value)}
              />
            </div>

            {/* Contract Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contract Type</label>
              <Select
                value={filters.contractType}
                onValueChange={(value) => handleFilterChange("contractType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="retainer">Retainer</SelectItem>
                  <SelectItem value="milestone">Milestone-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2">
            {selectedYear && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Year: {selectedYear}
                <button
                  onClick={() => setSelectedYear("")}
                  className="ml-1 hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            )}
            {filters.date && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Date: {format(filters.date, "MMM dd, yyyy")}
                <button
                  onClick={() => handleFilterChange("date", null)}
                  className="ml-1 hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            )}
            {filters.client && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Client: {filters.client}
                <button
                  onClick={() => handleFilterChange("client", "")}
                  className="ml-1 hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            )}
            {filters.contractType && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                Contract: {filters.contractType}
                <button
                  onClick={() => handleFilterChange("contractType", "")}
                  className="ml-1 hover:text-primary/70"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}