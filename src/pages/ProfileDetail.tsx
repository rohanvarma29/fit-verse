import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Instagram } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Add TypeScript declaration for Calendly
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
      initPopupWidget: (options: {
        url: string;
        prefill?: Record<string, string>;
        utm?: Record<string, string>;
      }) => void;
      showPopupWidget: (url: string) => void;
    };
  }
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  location: string;
  bio: string;
  profilePhoto: string | null;
  socialMedia?: string;
  meetLink?: string;
}

// Dummy program data
interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  sessions: number;
}

const dummyPrograms: Program[] = [
  {
    id: "1",
    title: "ALIGN : Transformation Program",
    description: "My signature program to massively up-level your life",
    duration: "8 weeks",
    price: "$3,150",
    sessions: 20,
  },
  {
    id: "2",
    title: "Clarity Call : Free Initial Consultation",
    description: "Get to know if my Coaching Program is the right fit for you",
    duration: "20 mins",
    price: "Free",
    sessions: 1,
  },
  {
    id: "3",
    title: "10 Additional Sessions (Package)",
    description: "Package of 10 more sessions to add to your program",
    duration: "Flexible",
    price: "$2,500",
    sessions: 10,
  },
  {
    id: "4",
    title: "5 Additional Sessions (Package)",
    description: "Package of 5 more sessions to add to your program",
    duration: "Flexible",
    price: "$1,350",
    sessions: 5,
  },
];

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getUserById(id);
        if (response.success && response.data) {
          console.log("Fetched user:", response.data);
          setUser(response.data);
        } else {
          setError(response.error || "Failed to fetch user");
        }
      } catch (err) {
        setError("An error occurred while fetching user");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    // Only load Calendly if user has a meetLink
    if (!user?.meetLink) return;

    // Add Calendly CSS to head
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      // Check if elements still exist before removing them
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user?.meetLink]);

  const openCalendlyPopup = () => {
    if (window.Calendly && user?.meetLink) {
      window.Calendly.initPopupWidget({
        url: user.meetLink,
      });
    }
  };

  return (
    <div className="min-h-screen bg-alabaster">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          Back
        </Button>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cambridge border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gunmetal">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
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
          user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Profile Information */}
              <div className="md:col-span-1">
                <div className="bg-amber-400 rounded-lg shadow-md p-8 flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="h-40 w-40 border-4 border-white shadow-md">
                      {user.profilePhoto ? (
                        <AvatarImage
                          src={
                            user.profilePhoto.startsWith("http")
                              ? user.profilePhoto
                              : `http://localhost:3000${user.profilePhoto}`
                          }
                          alt={user.displayName}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-cambridge text-alabaster text-4xl">
                          {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Badge className="bg-blue-500 text-white">
                        <svg
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Verified
                      </Badge>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gunmetal mb-4">
                    {user.displayName}
                  </h1>

                  <div className="text-center mb-6">
                    <p className="text-gunmetal whitespace-pre-wrap mb-4">
                      {user.bio || "No bio available"}
                    </p>

                    {user.socialMedia && (
                      <a
                        href={
                          user.socialMedia.startsWith("http")
                            ? user.socialMedia
                            : `https://instagram.com/${user.socialMedia}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gunmetal hover:text-cambridge transition-colors"
                      >
                        <Instagram className="h-5 w-5 mr-2" />
                        {user.socialMedia}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Program Details */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gunmetal mb-6">
                    Program Details
                  </h2>

                  <div className="mb-8">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {dummyPrograms.map((program) => (
                          <CarouselItem
                            key={program.id}
                            className="md:basis-1/2 lg:basis-1/2"
                          >
                            <Card className="h-full border border-gray-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xl">
                                  {program.title}
                                </CardTitle>
                                <CardDescription>
                                  {program.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    Duration:
                                  </span>
                                  <span className="text-sm font-medium">
                                    {program.duration}
                                  </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-gray-500">
                                    Sessions:
                                  </span>
                                  <span className="text-sm font-medium">
                                    x {program.sessions}
                                  </span>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between border-t pt-4">
                                <span className="font-bold text-lg">
                                  {program.price}
                                </span>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </CardFooter>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-end gap-2 mt-4">
                        <CarouselPrevious className="static translate-y-0 translate-x-0 position-relative" />
                        <CarouselNext className="static translate-y-0 translate-x-0 position-relative" />
                      </div>
                    </Carousel>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xl font-semibold text-gunmetal mb-4">
                      Schedule a Meeting
                    </h3>
                    <p className="text-gunmetal/70 mb-6">
                      {user.meetLink ? (
                        <>
                          You can schedule a meeting with this expert by
                          clicking the button below.
                        </>
                      ) : (
                        <>This expert hasn't set up their availability yet.</>
                      )}
                    </p>

                    {user.meetLink ? (
                      <Button
                        className="w-full md:w-auto bg-cambridge hover:bg-cambridge/90 text-white"
                        size="lg"
                        onClick={openCalendlyPopup}
                      >
                        Schedule A Meeting
                      </Button>
                    ) : (
                      <Button
                        className="w-full md:w-auto bg-gray-300 text-gray-600 cursor-not-allowed"
                        size="lg"
                        disabled
                      >
                        Schedule A Meeting
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
