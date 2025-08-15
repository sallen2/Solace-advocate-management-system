import db from "../../../db";
import { advocates } from "../../../db/schema";

// Type definitions based on database schema
interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: Date | null;
}

interface AdvocatesApiResponse {
  data: Advocate[];
}

export async function GET(): Promise<Response> {
  // Uncomment this line to use a database
  const rawAdvocateData = await db.select().from(advocates);
  
  // Transform the data to ensure proper typing for specialties field
  const advocateData: Advocate[] = rawAdvocateData.map(advocate => ({
    ...advocate,
    specialties: advocate.specialties as string[]
  }));

  return Response.json({ data: advocateData } satisfies AdvocatesApiResponse);
}
