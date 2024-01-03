import React from "react";
import styles from "./MovieCard.module.css";
import { formatDate } from "../../util/helper";

interface MovieCardProps {
  title: string;
  poster_path: string;
  genres: string;
  description: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  poster_path,
  genres,
  description,
  vote_average,
  vote_count,
  release_date,
  popularity,
}) => {
  const baseImageUrl = "https://image.tmdb.org/t/p/";
  const posterSize = "w300";

  const posterUrl = `${baseImageUrl}${posterSize}${poster_path}`;

  const formattedDate = release_date ? formatDate(release_date) : "-";

  return (
    <div className={styles.card}>
      <img src={posterUrl} alt={title} className={styles.poster} />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.releaseDate}>Release Date: {formattedDate}</p>
        <p className={styles.genres}>{genres}</p>
        <p className={styles.description}>{description}</p>
        {vote_average !== undefined && (
          <p className={styles.vote}>
            Rating: <b>{vote_average}</b>{" "}
            {vote_count !== undefined ? `(${vote_count})` : ""}
          </p>
        )}
        <small className={styles.popularity}>{popularity}</small>
      </div>
    </div>
  );
};

export default MovieCard;
