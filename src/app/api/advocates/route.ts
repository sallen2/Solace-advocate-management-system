import { or, ilike, sql, gt, and } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";

interface AdvocatesApiResponse {
  data: Advocate[];
  pagination: {
    hasMore: boolean;
    nextCursor?: number;
    limit: number;
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search');
    const limitParam = searchParams.get('limit');
    const cursorParam = searchParams.get('cursor');

    // Parse pagination parameters
    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    const cursor = cursorParam ? parseInt(cursorParam, 10) : 0;

    // Check if database is properly configured
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        data: [], 
        pagination: { hasMore: false, limit }
      } satisfies AdvocatesApiResponse);
    }

    let query = db.select().from(advocates);

    // Build conditions array
    const conditions = [];

    // Add cursor condition
    if (cursor > 0) {
      conditions.push(gt(advocates.id, cursor));
    }

    // Add search conditions
    if (searchTerm && searchTerm.trim()) {
      const searchPattern = `%${searchTerm.toLowerCase()}%`;
      
      conditions.push(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern),
          sql`lower(${advocates.specialties}::text) like ${searchPattern}`
        )
      );
    }

    // Apply conditions with AND
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by ID and apply limit (+1 to check if there are more records)
    const rawAdvocateData = await query
      .orderBy(advocates.id)
      .limit(limit + 1);
    
    // Check if there are more records
    const hasMore = rawAdvocateData.length > limit;
    const actualData = hasMore ? rawAdvocateData.slice(0, limit) : rawAdvocateData;
    
    // Get the next cursor (ID of the last item)
    const nextCursor = actualData.length > 0 ? actualData[actualData.length - 1].id : undefined;

    // Transform the data to ensure proper typing for specialties field
    const advocateData: Advocate[] = actualData.map((advocate: any) => ({
      ...advocate,
      specialties: advocate.specialties as string[]
    }));

    return Response.json({ 
      data: advocateData,
      pagination: {
        hasMore,
        nextCursor: hasMore ? nextCursor : undefined,
        limit
      }
    } satisfies AdvocatesApiResponse);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
