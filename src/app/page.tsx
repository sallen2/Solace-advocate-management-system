"use client";

import { useEffect, useState } from "react";
import { Advocate } from "../types/advocate";
import AdvocatesTable from "../components/AdvocatesTable";
import SearchInput from "../components/SearchInput";
import { useDebounce } from "../hooks/useDebounce";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch available advocates from the API
  const fetchAvailableAdvocates = async (search?: string): Promise<void> => {
    try {
      const searchParams = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`/api/advocates${searchParams}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch advocates: ${response.status}`);
      }

      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
    } catch (error) {
      console.error("Error fetching advocates:", error);
      // Could add error state here in the future
    }
  };

  // Initial load of advocates
  useEffect(() => {
    fetchAvailableAdvocates();
  }, []);

  // Fetch advocates when debounced search term changes
  useEffect(() => {
    fetchAvailableAdvocates(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const handleFilteringAdvocates = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResetSearchClick = () => {
    setSearchTerm("");
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Solace Advocates</h1>

      <SearchInput
        searchTerm={searchTerm}
        onSearchChange={handleFilteringAdvocates}
        onResetSearch={handleResetSearchClick}
      />

      <AdvocatesTable advocates={advocates} />
    </main>
  );
}
