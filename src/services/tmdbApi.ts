import axios from "axios";
import { Movie, Genre } from "../types/index";

const MOVIES_API_KEY: string = "2dca580c2a14b55200e784d157207b4d";
const TMDB_BASE_URL: string = "https://api.themoviedb.org/3";

const GENRE_API_KEY = "2dca580c2a14b55200e784d157207b4d";
const GENRE_BASE_URL = "https://api.themoviedb.org/3";

// interface Movie {
//   id: number;
//   title: string;
//   poster_path: string;
//   genres: Genre[];
//   overview: string;
// }

interface ApiResponse {
  results: Movie[];
}

export const fetchMoviesByYear = async (
  year: number,
  page: number = 1,
  genres: string = ""
): Promise<Movie[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${TMDB_BASE_URL}/discover/movie`,
      {
        params: {
          api_key: MOVIES_API_KEY,
          sort_by: "popularity.desc",
          primary_release_year: year,
          page,
          vote_count_gte: 100,
          with_genres: genres,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get(`${GENRE_BASE_URL}/genre/movie/list`, {
      params: { api_key: GENRE_API_KEY },
    });
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};
