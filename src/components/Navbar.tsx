
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  // Get user from localStorage
  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user') || '{}') 
    : null;

  return (
    <nav className="w-full bg-gunmetal text-alabaster border-b border-timberwolf/20 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cambridge via-cambridge/80 to-cambridge/60 bg-clip-text text-transparent">
                FitVerse
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-alabaster hover:text-cambridge transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-alabaster hover:text-cambridge transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-alabaster hover:text-cambridge transition-colors">
              Contact
            </Link>
            {user && (
              <Link to="/profile" className="text-alabaster hover:text-cambridge transition-colors">
                My Profile
              </Link>
            )}
          </div>
          <div>
            {user ? (
              <Button asChild variant="outline" className="rounded-full border-alabaster text-alabaster hover:bg-gunmetal/90">
                <Link to="/profile">
                  My Expert Profile
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full">
                <Link to="/register">
                  Become a FitVerse Expert
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
