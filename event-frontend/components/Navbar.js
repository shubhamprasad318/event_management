// components/Navbar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const guest = localStorage.getItem("guest");
    if (token) {
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
    setIsAuthenticated(false);
    setIsGuest(false);
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/" className="font-bold text-xl">
          Event Management
        </Link>
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>
        {isAuthenticated && (
          <Link href="/create-event" className="hover:underline">
            Create Event
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated && <span>Welcome, User</span>}
        {isGuest && <span>Guest User</span>}
        {!isAuthenticated && !isGuest ? (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
