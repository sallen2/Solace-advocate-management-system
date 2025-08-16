import { motion } from "framer-motion";
import { Advocate } from "../types/advocate";
import { containerVariants } from "../utils/animations";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import AdvocateCard from "./AdvocateCard";
import LoadingSpinner from "./LoadingSpinner";

interface AdvocatesListProps {
  advocates: Advocate[];
  loading: boolean;
  hasMoreAdvocates: boolean;
  onLoadMore: () => void;
}

export default function AdvocatesList({
  advocates,
  loading,
  hasMoreAdvocates,
  onLoadMore,
}: AdvocatesListProps) {
  const loadMoreRef = useIntersectionObserver({
    hasMore: hasMoreAdvocates,
    loading,
    onLoadMore,
    threshold: 0.1,
    rootMargin: "100px",
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <motion.ul
        className="space-y-4 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {advocates.map((advocate) => (
          <AdvocateCard key={advocate.id} advocate={advocate} />
        ))}
      </motion.ul>

      <div className="min-h-[80px] flex items-center justify-center">
        {loading && <LoadingSpinner message="Loading more advocates..." />}

        {advocates.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            No advocates found. Try adjusting your search criteria.
          </div>
        )}

        {!hasMoreAdvocates && advocates.length > 0 && !loading && (
          <div className="text-center text-gray-500 text-sm">
            You've reached the end of the results.
          </div>
        )}
      </div>

      {hasMoreAdvocates && !loading && (
        <div ref={loadMoreRef} className="h-1 w-full -mt-20" />
      )}
    </div>
  );
}
