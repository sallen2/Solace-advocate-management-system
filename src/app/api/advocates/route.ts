import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";

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
