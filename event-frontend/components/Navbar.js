// components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const guest = localStorage.getItem("guest");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setIsGuest(false);
    } else if (guest) {
      setIsGuest(true);
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(false);
      setIsGuest(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guest");
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <a className="font-bold text-xl">Event Management</a>
        </Link>
        <Link href="/">
          <a className="hover:underline">Dashboard</a>
        </Link>
        {isAuthenticated && (
          <Link href="/create-event">
            <a className="hover:underline">Create Event</a>
          </Link>
        )}
        <Link href="/search" className="hover:underline">
          Search
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated && user ? (
          <span>Welcome, {user.name}</span>
        ) : isGuest ? (
          <span>Guest User</span>
        ) : (
          <>
            <Link href="/login">
              <a className="hover:underline">Login</a>
            </Link>
            <Link href="/register">
              <a className="hover:underline">Register</a>
            </Link>
          </>
        )}
        {(isAuthenticated || isGuest) && (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
