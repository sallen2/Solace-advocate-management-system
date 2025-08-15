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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={handleFilteringAdvocates}
        />
        <button onClick={handleResetSearchClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
