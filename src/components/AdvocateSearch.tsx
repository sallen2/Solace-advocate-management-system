interface AdvocateSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSearch: () => void;
}

export default function AdvocateSearch({ 
  searchTerm, 
  onSearchChange, 
  onResetSearch 
}: AdvocateSearchProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-gray-800 mb-3" style={{ fontFamily: 'serif' }}>
          Find Your Advocate
        </h2>
        <p className="text-lg text-gray-600 font-light">
          Search through our community of health advocates
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-4 text-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-all duration-200 placeholder-gray-500 font-light"
            onChange={onSearchChange}
            placeholder="Search by name, city, specialty, or degree..."
            value={searchTerm}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {searchTerm && (
          <div className="flex items-center justify-between bg-teal-50 rounded-lg p-4">
            <p className="text-sm text-teal-700 font-light">
              Searching for: <span className="font-normal">"{searchTerm}"</span>
            </p>
            <button
              onClick={onResetSearch}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-5 rounded-lg transition-all duration-200 text-sm shadow-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}