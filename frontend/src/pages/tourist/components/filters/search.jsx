"use client";
import useRouter from "@/hooks/useRouter";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function SearchBar({ categories }) {
  const { searchParams, navigate, location } = useRouter();

  const handleSearchParam = (search) => {
    if (search) {
      if (!searchParams.has("searchBy")) searchParams.set("searchBy", "name");
      searchParams.set("search", search);
    } else searchParams.delete("search");
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const handleSearchBy = (searchBy) => {
    searchParams.set("searchBy", searchBy);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  return (
    <div className="mb-6 w-[360px]">
      <div className="relative flex items-center">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search"
            value={searchParams.get("search") ?? ""}
            onChange={(e) => handleSearchParam(e.target.value)}
            className="rounded-r-none pl-10 !ring-0 border border-gray-300 focus:border-gray-600"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Select
          value={searchParams.get("searchBy") ?? "name"}
          onValueChange={handleSearchBy}
        >
          <SelectTrigger className="w-[120px] border border-gray-300 focus:border-gray-600 rounded-l-none !ring-0">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category, index) => (
              <SelectItem key={index} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
