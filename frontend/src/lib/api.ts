export interface ApiAuthor {
  id: number;
  name: string;
  bio?: string;
}

export interface ApiGenre {
  id: number;
  name: string;
  slug: string;
  book_count?: number;
}

export interface ApiBook {
  id: number;
  title: string;
  subtitle?: string;
  isbn: string;
  summary: string;
  description: string;
  page_count: number;
  publication_year: number;
  language: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  publisher?: string;
  format?: string;
  target_audience?: string;
  cover_image_url?: string;
  created_at?: string;
  authors: ApiAuthor[];
  genres: ApiGenre[];
}

export interface ApiBookListResponse {
  total: number;
  limit: number;
  offset: number;
  items: ApiBook[];
}

export interface ApiAISearchResponse extends ApiBookListResponse {
  intent: 'book_search' | 'conversation';
  message?: string | null;
}

export interface BookFilterParams {
  search?: string;
  genre?: string;
  difficulty?: string;
  language?: string;
  max_page_count?: number;
  min_year?: number;
  limit?: number;
  offset?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:8000/api/v1');

/**
 * Fetch paginated & filtered list of books using native browser fetch API.
 */
export async function fetchBooks(params?: BookFilterParams): Promise<ApiBookListResponse> {
  const urlParams = new URLSearchParams();

  if (params?.search && params.search.trim()) {
    urlParams.append('search', params.search.trim());
  }

  if (params?.genre && params.genre !== 'All') {
    urlParams.append('genre', params.genre);
  }

  if (params?.difficulty && params.difficulty !== 'All') {
    urlParams.append('difficulty', params.difficulty);
  }

  if (params?.language && params.language !== 'All') {
    urlParams.append('language', params.language);
  }

  if (params?.max_page_count && params.max_page_count < 700) {
    urlParams.append('max_page_count', params.max_page_count.toString());
  }

  if (params?.min_year && params.min_year > 1930) {
    urlParams.append('min_year', params.min_year.toString());
  }

  if (params?.limit) {
    urlParams.append('limit', params.limit.toString());
  }

  if (params?.offset) {
    urlParams.append('offset', params.offset.toString());
  }

  const queryString = urlParams.toString();
  const requestUrl = `${API_BASE_URL}/books${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch available genres with book counts using native browser fetch API.
 */
export async function fetchGenres(): Promise<ApiGenre[]> {
  const response = await fetch(`${API_BASE_URL}/genres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Execute AI Natural Language Book Search / Assistant query via POST /api/v1/ai/search using native fetch.
 */
export async function fetchAiSearch(query: string, limit: number = 12, offset: number = 0): Promise<ApiAISearchResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({ query: query.trim(), limit, offset }),
  });

  if (!response.ok) {
    let errorDetail = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }

  return response.json();
}


