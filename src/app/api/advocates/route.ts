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

interface ParsedRequestParams {
  searchTerm: string | null;
  limit: number;
  cursor: number;
}

function parseRequestParameters(request: Request): ParsedRequestParams {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search");
  const limitParam = searchParams.get("limit");
  const cursorParam = searchParams.get("cursor");

  return {
    searchTerm,
    limit: limitParam ? parseInt(limitParam, 10) : 20,
    cursor: cursorParam ? parseInt(cursorParam, 10) : 0,
  };
}

function createSearchPattern(searchTerm: string): string {
  return `%${searchTerm.toLowerCase()}%`;
}

function buildSearchConditions(searchTerm: string | null) {
  if (!searchTerm || !searchTerm.trim()) {
    return null;
  }

  const searchPattern = createSearchPattern(searchTerm);

  return or(
    ilike(advocates.firstName, searchPattern),
    ilike(advocates.lastName, searchPattern),
    ilike(advocates.city, searchPattern),
    ilike(advocates.degree, searchPattern),
    sql`lower(${advocates.specialties}::text) like ${searchPattern}`
  );
}

function buildCursorCondition(cursor: number) {
  return cursor > 0 ? gt(advocates.id, cursor) : null;
}

async function queryAdvocatesFromDatabase(
  searchTerm: string | null,
  cursor: number,
  limit: number
) {
  let query = db.select().from(advocates);

  const conditions = [];

  const cursorCondition = buildCursorCondition(cursor);
  if (cursorCondition) {
    conditions.push(cursorCondition);
  }

  const searchConditions = buildSearchConditions(searchTerm);
  if (searchConditions) {
    conditions.push(searchConditions);
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  return await query.orderBy(advocates.id).limit(limit + 1);
}

function processQueryResults(
  rawData: any[],
  limit: number
): {
  hasMore: boolean;
  actualData: any[];
  nextCursor?: number;
} {
  const hasMore = rawData.length > limit;
  const actualData = hasMore ? rawData.slice(0, limit) : rawData;
  const nextCursor =
    actualData.length > 0 ? actualData[actualData.length - 1].id : undefined;

  return { hasMore, actualData, nextCursor };
}

function transformToAdvocateData(rawData: any[]): Advocate[] {
  return rawData.map((advocate: any) => ({
    ...advocate,
    specialties: advocate.specialties as string[],
  }));
}

function createAdvocatesResponse(
  advocateData: Advocate[],
  hasMore: boolean,
  nextCursor: number | undefined,
  limit: number
): AdvocatesApiResponse {
  return {
    data: advocateData,
    pagination: {
      hasMore,
      nextCursor: hasMore ? nextCursor : undefined,
      limit,
    },
  };
}

function createEmptyResponse(limit: number): AdvocatesApiResponse {
  return {
    data: [],
    pagination: { hasMore: false, limit },
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    // Parse and validate request parameters
    const { searchTerm, limit, cursor } = parseRequestParameters(request);

    // Handle database connection failure
    if (!process.env.DATABASE_URL) {
      return Response.json(createEmptyResponse(limit));
    }

    // Query advocates from database with search and pagination
    const rawAdvocateData = await queryAdvocatesFromDatabase(
      searchTerm,
      cursor,
      limit
    );

    // Process results and determine pagination info
    const { hasMore, actualData, nextCursor } = processQueryResults(
      rawAdvocateData,
      limit
    );

    // Transform raw data to properly typed Advocate objects
    const advocateData = transformToAdvocateData(actualData);

    // Create and return the API response
    const response = createAdvocatesResponse(
      advocateData,
      hasMore,
      nextCursor,
      limit
    );
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return Response.json(
      { error: "Failed to fetch advocates" },
      { status: 500 }
    );
  }
}
