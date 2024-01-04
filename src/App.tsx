import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import MovieList from "./components/MovieList/MovieList";
import "./App.css";

const App: React.FC = () => {
  const [searchString, setSearchString] = useState<string>("");
  return (
    <Router>
      <Header searchString={searchString} setSearchString={setSearchString} />
      <div className="parentWrapper">
        <Routes>
          <Route path="/" element={<MovieList searchString={searchString} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
