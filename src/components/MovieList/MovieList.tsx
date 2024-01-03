import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchMoviesByYear, fetchGenres } from "../../services/tmdbApi";
import { Movie, Genre } from "../../types/index";
import MovieCard from "../MovieCard/MovieCard";
import GenreFilter from "../GenreFilter/GenreFilter";
import { useThrottle } from "../../hooks/useThrottling";
import styles from "./MovieList.module.css";

const MovieList: React.FC = () => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [year, setYear] = useState<number>(2011);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastYearLoaded, setLastYearLoaded] = useState<number | null>(null);
  const loader = useRef<HTMLDivElement>(null);
  const topLoader = useRef<HTMLDivElement>(null);

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
  }, []);

  const sortMoviesByYearAndPopularity = (movies: Movie[]): Movie[] => {
    return movies.slice().sort((a, b) => {
      const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
      const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;

      // Sort by year first (descending)
      if (yearA > yearB) return -1;
      if (yearA < yearB) return 1;

      // If years are equal, then sort by popularity (descending)
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });
  };

  // useEffect(() => {
  //   loadMovies(2012);
  // }, []);

  const loadMovies = useCallback(
    async (newYear: number) => {
      if (lastYearLoaded === newYear) {
        return;
      }
      setIsLoading(true);
      setLastYearLoaded(newYear);

      try {
        const newMovies = await fetchMoviesByYear(newYear);
        setAllMovies((prevAllMovies) => {
          // Update allMovies with the newly loaded movies
          const newAllMovies =
            newYear > year
              ? [...prevAllMovies, ...newMovies]
              : [...newMovies, ...prevAllMovies];

          return sortMoviesByYearAndPopularity(newAllMovies) as Movie[];
        });

        // Update the movies to be displayed, considering the selected genres
        setMovies((prevMovies) => {
          const updatedFilteredMovies =
            selectedGenreIds.length === 0 || selectedGenreIds.includes(0)
              ? newYear > year
                ? [...prevMovies, ...newMovies]
                : [...newMovies, ...prevMovies]
              : newMovies.filter((movie) =>
                  movie.genre_ids.some((genreId: number) =>
                    selectedGenreIds.includes(genreId)
                  )
                );

          return sortMoviesByYearAndPopularity(
            updatedFilteredMovies
          ) as Movie[];
        });
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [year, lastYearLoaded, selectedGenreIds]
  );

  const throttledLoadMovies = useThrottle(loadMovies, 500);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entities) => {
  //       const target = entities[0];
  //       if (target.isIntersecting && !isLoading) {
  //         const newYear = target.intersectionRatio > 0 ? year + 1 : year - 1;
  //         throttledLoadMovies(newYear);
  //         setYear(newYear);
  //       }
  //     },
  //     {
  //       root: null,
  //       threshold: 0,
  //       rootMargin: "400px",
  //     }
  //   );

  //   if (loader.current) observer.observe(loader.current);

  //   return () => {
  //     if (loader.current) observer.unobserve(loader.current);
  //   };
  // }, [throttledLoadMovies, year, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entities) => {
        entities.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            if (entry.target === topLoader.current) {
              const newYear = year - 1;
              throttledLoadMovies(newYear);
              setYear(newYear);
            } else if (entry.target === loader.current) {
              const newYear = year + 1;
              throttledLoadMovies(newYear);
              setYear(newYear);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "400px",
      }
    );

    if (topLoader.current) {
      observer.observe(topLoader.current);
    }

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [throttledLoadMovies, year, isLoading]);

  useEffect(() => {
    if (selectedGenreIds.length === 0) {
      setMovies(allMovies);
    } else {
      const filteredMovies = allMovies.filter((movie) =>
        movie.genre_ids.some((genreId) => selectedGenreIds.includes(genreId))
      );
      setMovies(filteredMovies);
    }
  }, [allMovies, selectedGenreIds]);

  const onGenreChange = (selectedGenres: number[]) => {
    setSelectedGenreIds(selectedGenres);
  };

  return (
    <div className={styles.movieLayout}>
      <GenreFilter
        genres={genres}
        onGenreChange={onGenreChange}
        selectedGenreIds={selectedGenreIds}
      />

      <div className={styles.movieListContainer}>
        <div ref={topLoader} />
        {movies.length === 0 ? (
          <h3 className={styles.emptyMessage}>No movies available.</h3>
        ) : (
          movies.map((movie) => (
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
          ))
        )}
        <div ref={loader} />
        {/* {isLoading && <p>Loading movies...</p>} */}
      </div>
    </div>
  );
};

export default MovieList;
