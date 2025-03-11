import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <div
        className={`min-h-screen ${
          darkMode ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </Router>
  );
}

export default App;
