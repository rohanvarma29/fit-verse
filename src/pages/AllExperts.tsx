import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const AllExperts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
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

  return (
    <div className="min-h-screen bg-alabaster">
      <Navbar />

      {/* Page Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-cambridge/10 via-alabaster to-timberwolf">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gunmetal mb-6">
            All FitVerse Experts
          </h1>
          <p className="text-center text-gunmetal/70 max-w-2xl mx-auto">
            Browse our complete list of certified fitness experts, trainers, and
            wellness professionals ready to help you achieve your health goals.
          </p>
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
                  placeholder="Search by name or keywords"
                  className="form-input pl-10 w-full"
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
            </div>
          </div>
        </div>
      </section>

      {/* Experts List */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
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
            <>
              <div className="mb-6">
                <p className="text-gunmetal/70">
                  Showing {filteredUsers.length} experts
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <ExpertCard key={user._id} user={user} />
                ))}
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gunmetal/70">
                    No experts found matching your criteria.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
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
              ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${
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

export default AllExperts;
