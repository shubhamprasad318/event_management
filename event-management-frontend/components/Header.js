// components/Header.js
"use client";
import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-extrabold tracking-wide">Event Manager</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-lg">Welcome, <span className="font-semibold">{user.name}</span>!</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
