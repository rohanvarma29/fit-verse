import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/lib/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  location: string;
  bio: string;
  profilePhoto: string | null;
}

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        if (response.success && response.data) {
          setUsers(response.data);
        } else {
          setError(response.error || "Failed to fetch users");
        }
      } catch (err) {
        setError("An error occurred while fetching users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const displayName = user.displayName.toLowerCase();
    const bio = user.bio?.toLowerCase() || "";

    const matchesSearch =
      searchTerm === "" ||
      fullName.includes(searchTerm.toLowerCase()) ||
      displayName.includes(searchTerm.toLowerCase()) ||
      bio.includes(searchTerm.toLowerCase());

    const matchesLocation =
      selectedLocation === "" ||
      (user.location &&
        user.location.toLowerCase().includes(selectedLocation.toLowerCase()));

    return matchesSearch && matchesLocation;
  });

  // Get only the first 3 users for display on the landing page
  const displayUsers = filteredUsers.slice(0, 3);

  return (
    <div className="min-h-screen bg-alabaster">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-cambridge/10 via-alabaster to-timberwolf">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gunmetal">
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-cambridge via-cambridge/80 to-cambridge/60 bg-clip-text text-transparent">
                  Fitness & Nutrition
                </span>{" "}
                Partner!
              </h1>
              <p className="text-lg text-gunmetal/70">
                Connect with certified fitness trainers, nutritionists, and yoga
                instructors to achieve your health and wellness goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/register">Become an Expert</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-600 text-purple-700 hover:bg-purple-100 focus:ring-purple-500"
                  onClick={() => {
                    navigate("/expert/67f55fbcd0a3e3de463e54b3");
                  }}
                >
                  Profile View
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"
                alt="Fitness Training"
                className="rounded-lg shadow-xl object-cover h-[400px] w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop"
                      alt="Trainer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      500+ Certified Experts
                    </p>
                    <p className="text-xs text-gunmetal/60">
                      Ready to help you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white p-6 rounded-lg shadow-md -mt-10 relative z-10 border border-timberwolf/30">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search by keyword (e.g., Weight loss, Yoga)"
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="form-input pl-10"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Filter className="h-5 w-5" />
                </div>
                <select
                  className="form-input pl-10 appearance-none pr-8"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="fitness">Fitness Trainers</option>
                  <option value="nutrition">Nutritionists</option>
                  <option value="yoga">Yoga Trainers</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gunmetal">
              Explore our FitVerse Experts
            </h2>
            <Link to="/experts" className="text-cambridge hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cambridge border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gunmetal">Loading experts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayUsers.map((user) => (
                <ExpertCard key={user._id} user={user} />
              ))}

              <div className="bg-gradient-to-br from-cambridge/10 to-cambridge/5 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-cambridge/20 h-full">
                <h3 className="text-xl font-semibold mb-2 text-gunmetal">
                  Looking for more options?
                </h3>
                <p className="text-gunmetal/70 mb-4">
                  Discover all our certified fitness experts
                </p>
                <Button variant="outline" onClick={() => navigate("/experts")}>
                  View All Trainers
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 px-4 bg-timberwolf">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center text-gunmetal">
            Why Choose FitVerse?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-cambridge/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cambridge"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gunmetal">
                Certified Experts
              </h3>
              <p className="text-gunmetal/70">
                Every trainer, nutritionist, and yoga instructor is verified and
                certified in their field
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-cambridge/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cambridge"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gunmetal">
                Personalized Plans
              </h3>
              <p className="text-gunmetal/70">
                Custom fitness and nutrition plans tailored to your specific
                goals and needs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-cambridge/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cambridge"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gunmetal">
                Flexible Scheduling
              </h3>
              <p className="text-gunmetal/70">
                Book sessions that fit your schedule, with options for virtual
                or in-person training
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gunmetal text-alabaster">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Share Your Expertise?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of wellness professionals and start growing your
            client base
          </p>
          <Button
            asChild
            className="bg-cambridge hover:bg-cambridge/90"
            size="lg"
          >
            <Link to="/register">Become a FitVerse Expert</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gunmetal text-alabaster py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FitVerse</h3>
              <p className="text-timberwolf">
                Connecting wellness seekers with certified fitness and nutrition
                experts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Experts</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/register"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="#"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-timberwolf hover:text-cambridge transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-timberwolf/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-timberwolf/70">
              &copy; {new Date().getFullYear()} FitVerse. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="#"
                className="text-timberwolf/70 hover:text-cambridge transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-timberwolf/70 hover:text-cambridge transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-timberwolf/70 hover:text-cambridge transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.859.07-3.211 0-3.586-.015-4.859-.074-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ExpertCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/view/${user._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-timberwolf/30 hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={
            user.profilePhoto
              ? `${import.meta.env.VITE_SERVER_URL || "http://localhost:3000"}${
                  user.profilePhoto
                }`
              : "/placeholder.svg"
          }
          alt={user.displayName}
          className="h-48 w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-gunmetal">
          {user.displayName}
        </h3>
        <div className="flex items-center text-gunmetal/60 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {user.location || "Location not specified"}
        </div>
        <p className="text-gunmetal/70 text-sm mb-4 line-clamp-2">
          {user.bio || "No bio available"}
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default Landing;
