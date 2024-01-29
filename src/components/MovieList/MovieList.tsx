import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchMoviesByYear, fetchGenres } from "../../services/tmdbApi";
import { Movie, Genre } from "../../types/index";
import MovieCard from "../MovieCard/MovieCard";
import GenreFilter from "../GenreFilter/GenreFilter";
import { useThrottle } from "../../hooks/useThrottling";
import { useDebounce } from "../../hooks/useDebounce";
import styles from "./MovieList.module.css";

interface MovieListProps {
  searchString: string;
}

const MovieList: React.FC<MovieListProps> = ({ searchString }) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [moviesByYear, setMoviesByYear] = useState<{ [key: number]: Movie[] }>(
    {}
  );
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(2012);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    loadGenres();
    loadMovies(2012); // Initial load for 2012
  }, []);

  const filterMoviesByGenre = (
    movies: Movie[],
    genreIds: number[]
  ): Movie[] => {
    if (genreIds.length === 0 || genreIds.includes(0)) {
      return movies;
    }
    return movies.filter((movie) =>
      movie.genre_ids.some((genreId) => genreIds.includes(genreId))
    );
  };

  const loadMovies = useCallback(
    async (year: number, page: number = 1) => {
      setIsLoading(true);
      try {
        const newMovies = await fetchMoviesByYear(year, page);
        setMoviesByYear((prevMoviesByYear) => {
          const filteredMovies = filterMoviesByGenre(
            newMovies,
            selectedGenreIds
          );
          const sortedMovies = filteredMovies.sort(
            (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
          );
          return { ...prevMoviesByYear, [year]: sortedMovies };
        });
        setCurrentYear(year);
        setCurrentPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenreIds, currentYear, currentPage]
  );

  const throttledLoadMovies = useThrottle(loadMovies, 500);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entities) => {
        if (entities.some((entry) => entry.isIntersecting) && !isLoading) {
          throttledLoadMovies(currentYear + 1);
        }
      },
      { root: null, threshold: 0.1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [throttledLoadMovies, currentYear, isLoading]);

  const onGenreChange = (selectedGenres: number[]) => {
    setSelectedGenreIds(selectedGenres);
    setMoviesByYear({});
    loadMovies(2012);
  };

  const handleSearch = (searchString: string) => {
    if (searchString) {
      const lowerCaseSearchString = searchString.toLowerCase();
      const allMoviesArray = Object.values(moviesByYear).flat();
      const filtered = allMoviesArray.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowerCaseSearchString) ||
          movie.overview.toLowerCase().includes(lowerCaseSearchString) ||
          movie.release_date?.startsWith(searchString)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(Object.values(moviesByYear).flat());
    }
  };

  // Debouncing
  const debouncedHandleSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedHandleSearch(searchString);
  }, [searchString, moviesByYear]);

  return (
    <div className={styles.movieLayout}>
      <GenreFilter
        genres={genres}
        onGenreChange={onGenreChange}
        selectedGenreIds={selectedGenreIds}
      />

      <button
        className={styles.topLoader}
        onClick={() => loadMovies(currentYear - 1)}
      >
        Load older movies
      </button>

      <div className={styles.movieListContainer}>
        {Object.entries(moviesByYear).map(([year]) => (
          <React.Fragment key={year}>
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                genres={movie.genre_ids
                  .map(
                    (id) => genres.find((genre) => genre.id === id)?.name || ""
                  )
                  .join(", ")}
                description={movie.overview}
                release_date={movie.release_date}
                vote_average={movie.vote_average}
                vote_count={movie.vote_count}
                popularity={movie.popularity}
              />
            ))}
          </React.Fragment>
        ))}
        <div ref={loader} className={styles.loader} />
        {isLoading && <p>Loading movies...</p>}
      </div>
    </div>
  );
};

export default MovieList;
