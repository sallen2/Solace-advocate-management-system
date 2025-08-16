import { useEffect, useRef } from "react";
import { Advocate } from "../types/advocate";
import { formatPhoneNumber } from "../utils/formatPhone";
import LoadingSpinner from "./LoadingSpinner";

interface AdvocatesTableProps {
  advocates: Advocate[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function AdvocatesTable({
  advocates,
  loading,
  hasMore,
  onLoadMore,
}: AdvocatesTableProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentRef = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before the element is visible
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div>
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
            <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
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
                <td className="border border-gray-300 px-4 py-3 text-sm whitespace-nowrap">
                  {formatPhoneNumber(advocate.phoneNumber)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Loading and status section with fixed height to prevent layout shift */}
      <div className="min-h-[80px] flex items-center justify-center">
        {loading && <LoadingSpinner message="Loading more advocates..." />}

        {/* Empty state */}
        {advocates.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            No advocates found. Try adjusting your search criteria.
          </div>
        )}

        {/* End of results message */}
        {!hasMore && advocates.length > 0 && !loading && (
          <div className="text-center text-gray-500 text-sm">
            You've reached the end of the results.
          </div>
        )}
      </div>

      {/* Intersection observer trigger - positioned slightly above the loading area */}
      {hasMore && !loading && (
        <div ref={loadMoreRef} className="h-1 w-full -mt-20" />
      )}
    </div>
  );
}
