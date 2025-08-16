"use client";

import { useState } from "react";
import AdvocatesList from "../components/AdvocatesList";
import AdvocateSearch from "../components/AdvocateSearch";
import PageHeader from "../components/PageHeader";
import ErrorMessage from "../components/ErrorMessage";
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
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-6 py-12 max-w-6xl flex flex-col gap-8">
        <PageHeader 
          title="Solace Advocate Search"
          subtitle="Discover and connect with our community of health advocates"
        />

        <AdvocateSearch
          searchTerm={searchTerm}
          onSearchChange={handleFilteringAdvocates}
          onResetSearch={handleResetSearchClick}
        />

        <ErrorMessage error={error} />

        <AdvocatesList
          advocates={advocates}
          loading={loading}
          hasMoreAdvocates={hasMore}
          onLoadMore={loadMoreAdvocates}
        />
      </section>
    </main>
  );
}
