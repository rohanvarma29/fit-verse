
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExpertCategory = "fitness" | "nutrition" | "yoga";

interface Expert {
  id: string;
  name: string;
  category: ExpertCategory;
  location: string;
  description: string;
  image: string;
  rating: number;
}

const mockExperts: Expert[] = [
  {
    id: "1",
    name: "Alex Johnson",
    category: "fitness",
    location: "New York, NY",
    description: "Certified Personal Trainer specializing in strength training and HIIT workouts",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Sarah Miller",
    category: "nutrition",
    location: "Los Angeles, CA",
    description: "Registered Dietitian with focus on plant-based nutrition and sustainable eating habits",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: "3",
    name: "David Chen",
    category: "yoga",
    location: "San Francisco, CA",
    description: "Yoga Alliance certified instructor with 10+ years experience in Hatha and Vinyasa yoga",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Priya Patel",
    category: "fitness",
    location: "Chicago, IL",
    description: "CrossFit Level 3 Trainer specializing in functional fitness and mobility",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.9,
  },
  {
    id: "5",
    name: "Michael Rodriguez",
    category: "nutrition",
    location: "Miami, FL",
    description: "Sports Nutritionist working with athletes to optimize performance and recovery",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Emma Wilson",
    category: "yoga",
    location: "Austin, TX",
    description: "Mindfulness coach and yoga instructor specializing in restorative practices",
    image: "https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 4.8,
  },
];

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExpertCategory | "all">("all");
  const [selectedLocation, setSelectedLocation] = useState("");

  const filteredExperts = mockExperts.filter((expert) => {
    const matchesSearch =
      searchTerm === "" ||
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || expert.category === selectedCategory;

    const matchesLocation =
      selectedLocation === "" ||
      expert.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getExpertsByCategory = (category: ExpertCategory) => {
    return mockExperts.filter((expert) => expert.category === category).slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-accent-light">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-white to-accent-muted">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Fitness & Nutrition</span> Partner!
              </h1>
              <p className="text-lg text-gray-600">
                Connect with certified fitness trainers, nutritionists, and yoga instructors
                to achieve your health and wellness goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/register">Become an Expert</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
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
                    <p className="font-semibold text-sm">500+ Certified Experts</p>
                    <p className="text-xs text-gray-500">Ready to help you</p>
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
          <div className="bg-white p-6 rounded-lg shadow-md -mt-10 relative z-10">
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
                  onChange={(e) => setSelectedCategory(e.target.value as ExpertCategory | "all")}
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

      {/* Featured Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Our Expert Categories</h2>

          {/* Category: Fitness Trainers */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Fitness Trainers</h3>
              <Link to="#" className="text-primary hover:underline">View All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getExpertsByCategory("fitness").map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-primary/20 h-full">
                <h3 className="text-xl font-semibold mb-2">Looking for more options?</h3>
                <p className="text-gray-600 mb-4">Discover all our certified fitness trainers</p>
                <Button variant="outline">View All Trainers</Button>
              </div>
            </div>
          </div>

          {/* Category: Nutritionists */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Nutritionists</h3>
              <Link to="#" className="text-primary hover:underline">View All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getExpertsByCategory("nutrition").map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-primary/20 h-full">
                <h3 className="text-xl font-semibold mb-2">Need nutrition advice?</h3>
                <p className="text-gray-600 mb-4">Connect with our certified nutritionists</p>
                <Button variant="outline">View All Nutritionists</Button>
              </div>
            </div>
          </div>

          {/* Category: Yoga Trainers */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Yoga Trainers</h3>
              <Link to="#" className="text-primary hover:underline">View All</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getExpertsByCategory("yoga").map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-primary/20 h-full">
                <h3 className="text-xl font-semibold mb-2">Find inner peace</h3>
                <p className="text-gray-600 mb-4">Explore our yoga and mindfulness experts</p>
                <Button variant="outline">View All Yoga Trainers</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 px-4 bg-accent-muted">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose FitVerse?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Experts</h3>
              <p className="text-gray-600">
                Every trainer, nutritionist, and yoga instructor is verified and certified in their field
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
              <p className="text-gray-600">
                Custom fitness and nutrition plans tailored to your specific goals and needs
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book sessions that fit your schedule, with options for virtual or in-person training
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Expertise?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of wellness professionals and start growing your client base
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/register">Become a FitVerse Expert</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FitVerse</h3>
              <p className="text-gray-300">
                Connecting wellness seekers with certified fitness and nutrition experts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Experts</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} FitVerse. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Expert Card Component
const ExpertCard = ({ expert }: { expert: Expert }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={expert.image}
          alt={expert.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium flex items-center shadow-sm">
          <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
          {expert.rating}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {expert.category === "fitness"
                ? "Fitness Trainer"
                : expert.category === "nutrition"
                ? "Nutritionist"
                : "Yoga Trainer"}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-1">{expert.name}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {expert.location}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {expert.description}
        </p>
        <Button variant="outline" className="w-full">
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default Landing;
