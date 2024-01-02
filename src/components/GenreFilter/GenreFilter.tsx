import React, { memo } from "react";
import styles from "./GenreFilter.module.css";
import { Genre } from "../../types/index";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreIds: number[];
  onGenreChange: (selectedGenres: number[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = memo(
  ({ genres, selectedGenreIds, onGenreChange }) => {
    const toggleGenre = (genreId: number) => {
      const newSelectedGenres = selectedGenreIds.includes(genreId)
        ? selectedGenreIds.filter((id) => id !== genreId)
        : [...selectedGenreIds, genreId];
      onGenreChange(newSelectedGenres);
    };

    const selectAllGenres = () => {
      if (selectedGenreIds.length === genres.length) {
        onGenreChange([]);
      } else {
        onGenreChange(genres.map((genre) => genre.id));
      }
    };

    return (
      <div className={styles.genreFilter}>
        <button
          className={
            selectedGenreIds.length === genres.length ? styles.selected : ""
          }
          onClick={selectAllGenres}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={
              selectedGenreIds.includes(genre.id) ? styles.selected : ""
            }
            onClick={() => toggleGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    );
  }
);

export default GenreFilter;
