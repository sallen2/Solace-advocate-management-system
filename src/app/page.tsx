"use client";

import { useState } from "react";
import AdvocatesTable from "../components/AdvocatesTable";
import SearchInput from "../components/SearchInput";
import { useDebounce } from "../hooks/useDebounce";
import { useAdvocatesInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounce the search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use advocates infinite scroll hook
  const { advocates, loading, hasMore, loadMoreAdvocates, error } =
    useAdvocatesInfiniteScroll({
      searchTerm: debouncedSearchTerm,
      limit: 10,
    });

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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <AdvocatesTable
        advocates={advocates}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMoreAdvocates}
      />
    </main>
  );
}
