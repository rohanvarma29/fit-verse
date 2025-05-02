import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ExternalLink, CheckCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AvailabilitySectionProps {
  meetLink: string | undefined;
  onUpdateAvailability: (meetLink: string) => Promise<void>;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  meetLink,
  onUpdateAvailability,
}) => {
  const [calendlyLink, setCalendlyLink] = useState(meetLink || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!calendlyLink.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid Calendly link",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateAvailability(calendlyLink);
      toast({
        title: "Success",
        description: "Your availability link has been updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update availability link",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gunmetal">Availability</h2>
        <p className="text-gunmetal/70">
          Connect your Calendly account to let clients schedule meetings with
          you.
        </p>
      </div>

      <Card className="bg-cambridge/5 border-cambridge/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cambridge mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gunmetal mb-2">
                How to set up your Calendly
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gunmetal/80">
                <li>
                  Go to{" "}
                  <a
                    href="https://calendly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cambridge hover:underline inline-flex items-center"
                  >
                    Calendly.com <ExternalLink className="h-3 w-3 ml-1" />
                  </a>{" "}
                  and create an account
                </li>
                <li>Set up your availability preferences</li>
                <li>Create an event type (e.g., "30 Minute Meeting")</li>
                <li>Copy your event link from Calendly</li>
                <li>Paste it below and click "Update Availability"</li>
              </ol>
              <p className="mt-3 text-sm text-gunmetal/70">
                Your Calendly link should look like:
                https://calendly.com/yourusername/30min
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="calendly-link">Your Calendly Link</Label>
          <div className="flex gap-2">
            <Input
              id="calendly-link"
              placeholder="https://calendly.com/yourusername/30min"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-sm text-gunmetal/60">
            Paste your Calendly event link here. This will be displayed on your
            public profile.
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {isSubmitting ? "Updating..." : "Update Availability"}
          </Button>
        </div>
      </form>

      {meetLink && (
        <Card className="mt-6 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="w-full">
                <h3 className="font-medium text-gunmetal mb-2 flex items-center">
                  Your Current Availability Link
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="bg-white p-2 rounded border flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cambridge hover:underline text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {meetLink}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(meetLink, "_blank")}
                      className="whitespace-nowrap"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          "https://calendly.com/event_types/user/me",
                          "_blank"
                        )
                      }
                      className="whitespace-nowrap"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gunmetal/70">
                  This link will be displayed on your public profile for clients
                  to schedule meetings with you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilitySection;
