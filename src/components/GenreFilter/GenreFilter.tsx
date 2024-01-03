//
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
      let newSelectedGenres;
      if (
        selectedGenreIds.length === 0 ||
        selectedGenreIds.length === genres.length
      ) {
        // If 'All' is currently selected, or no genres are selected, select only the clicked genre
        newSelectedGenres = [genreId];
      } else if (selectedGenreIds.includes(genreId)) {
        // Deselect genre and if none left, select 'All'
        newSelectedGenres = selectedGenreIds.filter((id) => id !== genreId);
        if (newSelectedGenres.length === 0) {
          newSelectedGenres = genres.map((genre) => genre.id);
        }
      } else {
        // Add genre to the selection
        newSelectedGenres = [...selectedGenreIds, genreId];
      }
      onGenreChange(newSelectedGenres);
    };

    const selectAllGenres = () => {
      // Select 'All' genres
      onGenreChange(genres.map((genre) => genre.id));
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
