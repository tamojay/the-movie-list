import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import MovieList from "./components/MovieList/MovieList";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="parentWrapper">
        <Routes>
          <Route path="/" element={<MovieList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
