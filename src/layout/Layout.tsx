import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import MovieList from "../components/MovieList/MovieList";
import MovieDetail from "../components/MovieDetail/MovieDetail";
import styles from "./Layout.module.css";

const Layout: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className={styles.elementContainer}>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Layout;
