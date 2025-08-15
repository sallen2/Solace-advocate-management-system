"use client";

import { useEffect, useState } from "react";
import { Advocate } from "../types/advocate";
import AdvocatesTable from "../components/AdvocatesTable";
import SearchInput from "../components/SearchInput";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch available advocates from the API
  const fetchAvailableAdvocates = async (): Promise<void> => {
    try {
      const response = await fetch("/api/advocates");

      if (!response.ok) {
        throw new Error(`Failed to fetch advocates: ${response.status}`);
      }

      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setFilteredAdvocates(jsonResponse.data);
    } catch (error) {
      console.error("Error fetching advocates:", error);
      // Could add error state here in the future
    }
  };

  useEffect(() => {
    fetchAvailableAdvocates();
  }, []);

  // Filter function to check if an advocate matches the search term
  const matchesSearchTerm = (
    advocate: Advocate,
    searchTerm: string
  ): boolean => {
    if (!searchTerm) return true;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
      advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
      advocate.city.toLowerCase().includes(lowerSearchTerm) ||
      advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
      advocate.specialties.some((specialty) =>
        specialty.toLowerCase().includes(lowerSearchTerm)
      ) ||
      advocate.yearsOfExperience.toString().includes(searchTerm)
    );
  };

  const handleFilteringAdvocates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    const filteredAdvocates = advocates.filter((advocate) =>
      matchesSearchTerm(advocate, newSearchTerm)
    );

    setFilteredAdvocates(filteredAdvocates);
  };

  const handleResetSearchClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Solace Advocates</h1>

      <SearchInput
        searchTerm={searchTerm}
        onSearchChange={handleFilteringAdvocates}
        onResetSearch={handleResetSearchClick}
      />

      <AdvocatesTable advocates={filteredAdvocates} />
    </main>
  );
}
