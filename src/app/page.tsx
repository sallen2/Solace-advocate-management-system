"use client";

import { useEffect, useState } from "react";
import { Advocate } from "../types/advocate";

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
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="container mx-auto px-6 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Solace Advocates</h1>

      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Search</h2>
        <p className="mb-2 text-sm text-gray-600">
          Searching for: <span id="search-term" className="font-medium"></span>
        </p>
        <div className="flex gap-4 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleFilteringAdvocates}
            placeholder="Search advocates..."
          />
          <button
            onClick={handleResetSearchClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Reset Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                First Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Last Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                City
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Degree
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Specialties
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Years of Experience
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => {
              return (
                <tr
                  key={advocate.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.firstName}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.city}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.degree}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.specialties.map((s, i) => (
                      <div key={i} className="mb-1 last:mb-0">
                        {s}
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-sm">
                    {advocate.phoneNumber}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
