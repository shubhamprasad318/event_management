// components/Layout.js
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        &copy; {new Date().getFullYear()} Event Management
      </footer>
    </div>
  );
}
