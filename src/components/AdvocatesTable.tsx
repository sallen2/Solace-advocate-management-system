import { Advocate } from "../types/advocate";

interface AdvocatesTableProps {
  advocates: Advocate[];
}

export default function AdvocatesTable({ advocates }: AdvocatesTableProps) {
  return (
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
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {advocate.phoneNumber}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}