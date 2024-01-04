import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

interface HeaderProps {
  searchString: string;
  setSearchString: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchString, setSearchString }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <h2>TMDb</h2>
      </Link>
      <input
        value={searchString}
        onChange={handleSearchChange}
        placeholder="🔎 Search movies"
        className={styles.searchInput}
      />
    </header>
  );
};

export default Header;
