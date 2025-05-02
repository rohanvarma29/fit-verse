import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/api";

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
  meetLink?: string;
}

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

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cambridge border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gunmetal">Loading profile...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gunmetal mb-4">
                Profile view of user with user id: {id}
              </h1>

              {user && (
                <div className="mt-6">
                  <p className="text-gunmetal/70 mb-6">
                    This page will be expanded in the future to show more
                    details about the user.
                  </p>

                  <div className="mt-8 border-t pt-6">
                    <h2 className="text-xl font-semibold text-gunmetal mb-4">
                      Schedule a Meeting
                    </h2>
                    <p className="text-gunmetal/70 mb-6">
                      {user.meetLink ? (
                        <>
                          You can schedule a meeting with this fitness expert by
                          clicking the button below.
                        </>
                      ) : (
                        <>This expert hasn't set up their availability yet.</>
                      )}
                    </p>

                    {user.meetLink ? (
                      <Button
                        className="mb-6 bg-cambridge hover:bg-cambridge/90 text-white"
                        size="lg"
                        onClick={openCalendlyPopup}
                      >
                        Schedule A Meeting
                      </Button>
                    ) : (
                      <Button
                        className="mb-6 bg-gray-300 text-gray-600 cursor-not-allowed"
                        size="lg"
                        disabled
                      >
                        Schedule A Meeting
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
