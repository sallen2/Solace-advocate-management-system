import { motion } from "framer-motion";
import { Advocate } from "../types/advocate";
import { formatPhoneNumber } from "../utils/formatPhone";
import { slideUpVariants } from "../utils/animations";

interface AdvocateCardProps {
  advocate: Advocate;
}

export default function AdvocateCard({ advocate }: AdvocateCardProps) {
  return (
    <motion.li
      key={advocate.id}
      variants={slideUpVariants}
      className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-200"
    >
      <div className="flex flex-col space-y-4">
        {/* Header with name and location */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'serif' }}>
              {advocate.firstName} {advocate.lastName}
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-light">
              📍 {advocate.city}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 text-right">
            <p className="text-sm font-medium text-teal-700">
              {advocate.degree}
            </p>
            <p className="text-sm text-gray-500 font-light">
              {advocate.yearsOfExperience} years experience
            </p>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-sm font-light text-gray-700 mb-3">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {advocate.specialties.map((specialty, i) => (
              <span 
                key={i} 
                className="inline-block bg-teal-50 text-teal-700 text-xs px-3 py-2 rounded-full font-light border border-teal-100"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 font-light">
            📞 {formatPhoneNumber(advocate.phoneNumber)}
          </p>
        </div>
      </div>
    </motion.li>
  );
}