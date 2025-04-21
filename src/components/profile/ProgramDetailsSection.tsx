
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

const ProgramDetailsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gunmetal">Program Details</h2>
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-timberwolf mb-4">
            You haven't added any programs yet.
          </p>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Your First Program
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProgramDetailsSection;
