import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchMoviesByYear, fetchGenres } from "../../services/tmdbApi";
import { Movie, Genre } from "../../types/index";
import MovieCard from "../MovieCard/MovieCard";
import GenreFilter from "../GenreFilter/GenreFilter";
import { useThrottle } from "../../hooks/useThrottling";
import styles from "./MovieList.module.css";

const MovieList: React.FC = () => {
  const [moviesByYear, setMoviesByYear] = useState<{ [key: number]: Movie[] }>(
    {}
  );
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(2012);
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
    async (year: number) => {
      setIsLoading(true);
      try {
        const newMovies = await fetchMoviesByYear(year);
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
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenreIds]
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
    setMoviesByYear({}); // Reset the movies
    loadMovies(2012); // Reload with the new genre filter
  };

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
        {Object.entries(moviesByYear).map(([year, movies]) => (
          <React.Fragment key={year}>
            {movies.map((movie) => (
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
