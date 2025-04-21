
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Plus } from "lucide-react";

const ProgramDetailsSection = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gunmetal">Program Details</h2>
        <Button className="bg-cambridge hover:bg-cambridge/90 text-white shadow-sm transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <Card className="p-8 border-none shadow-sm bg-white rounded-xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-cambridge/10 p-6 rounded-full mb-6">
            <CalendarPlus className="h-12 w-12 text-cambridge" />
          </div>
          <h3 className="text-xl font-medium text-gunmetal mb-2">No Programs Yet</h3>
          <p className="text-timberwolf mb-6 max-w-md">
            Start creating your fitness programs to attract clients and showcase your expertise.
          </p>
          <Button size="lg" className="bg-cambridge hover:bg-cambridge/90 text-white shadow-sm transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Program
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProgramDetailsSection;
