import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <h2>TMDb</h2>
      </Link>
      <input
        placeholder="🔎 Search movies by name, year or genre"
        className={styles.searchInput}
      />
    </header>
  );
};

export default Header;
