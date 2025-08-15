interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetSearch: () => void;
}

export default function SearchInput({ 
  searchTerm, 
  onSearchChange, 
  onResetSearch 
}: SearchInputProps) {
  return (
    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Search</h2>
      <p className="mb-2 text-sm text-gray-600">
        Searching for: <span className="font-medium">{searchTerm}</span>
      </p>
      <div className="flex gap-4 items-center">
        <input
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={onSearchChange}
          placeholder="Search advocates..."
          value={searchTerm}
        />
        <button
          onClick={onResetSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Reset Search
        </button>
      </div>
    </div>
  );
}