"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react"

export function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("name");
    return <div className="mb-6">
    <div className="relative flex items-center">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search in"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-r-none pl-10 !ring-0" 
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Select value={searchCategory} onValueChange={setSearchCategory}>
        <SelectTrigger className="w-[120px] rounded-l-none border-l-0 !ring-0">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="category">Category</SelectItem>
          <SelectItem value="tag">Tag</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
}