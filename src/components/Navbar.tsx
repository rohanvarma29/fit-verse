import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-alabaster hover:text-cambridge transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-alabaster hover:text-cambridge transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-alabaster hover:text-cambridge transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link to="/register" className="rounded-full">
                Become a FitVerse Expert
              </Link>
            </Button>
            <Button asChild>
              <Link to="/login" className="rounded-full">
                Expert Sign In
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-alabaster">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gunmetal text-alabaster w-[80%] p-0 [&>button]:hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-timberwolf/20 flex justify-between items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-cambridge via-cambridge/80 to-cambridge/60 bg-clip-text text-transparent">
                      FitVerse
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5 text-alabaster" />
                    </Button>
                  </div>
                  <div className="flex flex-col p-4 space-y-4">
                    <Link
                      to="/"
                      className="text-alabaster hover:text-cambridge transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/about"
                      className="text-alabaster hover:text-cambridge transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className="text-alabaster hover:text-cambridge transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                    <div className="pt-4 space-y-4">
                      <Button asChild className="w-full">
                        <Link
                          to="/register"
                          className="rounded-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Become a FitVerse Expert
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link
                          to="/login"
                          className="rounded-full"
                          onClick={() => setIsOpen(false)}
                        >
                          Expert Sign In
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
