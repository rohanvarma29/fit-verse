
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
];

const AvailabilitySection = () => {
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    DAYS_OF_WEEK.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const handleTimeSlotToggle = (day: string, timeSlot: string) => {
    setAvailability((prev) => {
      const updatedSlots = prev[day].includes(timeSlot)
        ? prev[day].filter((slot) => slot !== timeSlot)
        : [...prev[day], timeSlot];

      return {
        ...prev,
        [day]: updatedSlots,
      };
    });
  };

  const handleSaveAvailability = () => {
    console.log("Saving availability:", availability);
    // Here would be API call to save availability
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gunmetal">Availability</h2>

      <Card className="p-6">
        <p className="text-gunmetal mb-6">
          Set your weekly availability by selecting the times you're available to work with clients.
        </p>

        <div className="grid md:grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="space-y-3">
              <h3 className="font-medium text-cambridge">{day}</h3>
              <div className="space-y-2">
                {TIME_SLOTS.map((timeSlot) => (
                  <div key={`${day}-${timeSlot}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${day}-${timeSlot}`}
                      checked={availability[day].includes(timeSlot)}
                      onCheckedChange={() => handleTimeSlotToggle(day, timeSlot)}
                    />
                    <Label
                      htmlFor={`${day}-${timeSlot}`}
                      className="text-xs cursor-pointer"
                    >
                      {timeSlot}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveAvailability}>
            Save Availability
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AvailabilitySection;
