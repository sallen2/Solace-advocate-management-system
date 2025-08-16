import { or, ilike, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";

interface AdvocatesApiResponse {
  data: Advocate[];
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');

    // Check if database is properly configured
    if (!process.env.DATABASE_URL) {
      return Response.json({ data: [] } satisfies AdvocatesApiResponse);
    }

    let rawAdvocateData;

    if (searchTerm && searchTerm.trim()) {
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      
      rawAdvocateData = await db
        .select()
        .from(advocates)
        .where(
          or(
            ilike(advocates.firstName, searchPattern),
            ilike(advocates.lastName, searchPattern),
            ilike(advocates.city, searchPattern),
            ilike(advocates.degree, searchPattern),
            sql`lower(${advocates.specialties}::text) like ${searchPattern}`
          )
        );
    } else {
      rawAdvocateData = await db.select().from(advocates);
    }
    
    // Transform the data to ensure proper typing for specialties field
    const advocateData: Advocate[] = rawAdvocateData.map((advocate: any) => ({
      ...advocate,
      specialties: advocate.specialties as string[]
    }));

    return Response.json({ data: advocateData } satisfies AdvocatesApiResponse);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
