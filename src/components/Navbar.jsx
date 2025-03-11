import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Vote } from 'lucide-react';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              VanishVote
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/create"
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Create Poll
            </Link>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;