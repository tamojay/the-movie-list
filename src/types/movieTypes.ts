export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres?: string[];
  genre_ids: number[];
  release_date?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
}
