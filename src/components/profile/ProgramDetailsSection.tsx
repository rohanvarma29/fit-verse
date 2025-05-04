import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import {
  createProgram,
  getProgramsByExpertId,
  deleteProgram,
  updateProgram,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface Program {
  _id: string;
  programName: string;
  programDescription: string;
  programDuration: string;
  programPrice: string;
  expert: string;
  createdAt: string;
  updatedAt: string;
}

interface ProgramDetailsSectionProps {
  user: any;
  refreshUser: () => Promise<void>;
}

const ProgramDetailsSection: React.FC<ProgramDetailsSectionProps> = ({
  user,
  refreshUser,
}) => {
  const { id } = useParams<{ id: string }>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    programName: "",
    programDescription: "",
    programDuration: "",
    programPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCurrentUserExpert = user && user._id === id;

  const fetchPrograms = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getProgramsByExpertId(id);
      if (response.success && response.data) {
        setPrograms(response.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [id]);

  useEffect(() => {
    if (isDialogOpen) {
      setFormData({
        programName: "",
        programDescription: "",
        programDuration: "",
        programPrice: "",
      });
    }
  }, [isDialogOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.programName ||
      !formData.programDescription ||
      !formData.programDuration ||
      !formData.programPrice
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createProgram(formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Program created successfully",
        });

        // Reset form and close dialog
        setFormData({
          programName: "",
          programDescription: "",
          programDuration: "",
          programPrice: "",
        });
        setIsDialogOpen(false);

        // Refresh programs list
        fetchPrograms();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create program",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgramCards = () => {
    return programs.map((program) => (
      <Card key={program._id} className="h-full border border-gray-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{program.programName}</CardTitle>
          <CardDescription className="overflow-hidden text-ellipsis">
            {program.programDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Duration:</span>
            <span className="text-sm font-medium">
              {program.programDuration}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <span className="font-bold text-lg">{program.programPrice}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Open the edit dialog and populate it with the program's data
                setFormData({
                  programName: program.programName,
                  programDescription: program.programDescription,
                  programDuration: program.programDuration,
                  programPrice: program.programPrice,
                });
                setSelectedProgram(program);
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this program?"
                  )
                ) {
                  deleteProgram(program._id)
                    .then((response) => {
                      if (response.success) {
                        toast({
                          title: "Success",
                          description: "Program deleted successfully",
                        });
                        fetchPrograms(); // Refresh the program list
                      } else {
                        toast({
                          title: "Error",
                          description:
                            response.error || "Failed to delete program",
                          variant: "destructive",
                        });
                      }
                    })
                    .catch((error) => {
                      toast({
                        title: "Error",
                        description: "An unexpected error occurred",
                        variant: "destructive",
                      });
                    });
                }
              }}
            >
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    ));
  };

  const renderCreateFirstProgramSection = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-cambridge/10 p-6 rounded-full mb-6">
          <CalendarPlus className="h-12 w-12 text-cambridge" />
        </div>
        <h3 className="text-xl font-medium text-gunmetal mb-2">
          No Programs Yet
        </h3>
        <p className="text-timberwolf mb-6 max-w-md">
          Start creating your fitness programs to attract clients and showcase
          your expertise.
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-cambridge hover:bg-cambridge/90 text-white shadow-sm transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Program</DialogTitle>
              <DialogDescription>
                Fill in the details for your new fitness program.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="programName">Program Name*</Label>
                  <Input
                    id="programName"
                    name="programName"
                    value={formData.programName}
                    onChange={handleInputChange}
                    placeholder="Enter program name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="programDescription">
                    Program Description*
                  </Label>
                  <Textarea
                    id="programDescription"
                    name="programDescription"
                    value={formData.programDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your program"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="programDuration">Duration*</Label>
                  <Input
                    id="programDuration"
                    name="programDuration"
                    value={formData.programDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 8 weeks"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="programPrice">Price*</Label>
                  <Input
                    id="programPrice"
                    name="programPrice"
                    value={formData.programPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., $99.99"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Program"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gunmetal">Program Details</h2>
        {isCurrentUserExpert && programs.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cambridge hover:bg-cambridge/90 text-white shadow-sm transition-all">
                <Plus className="mr-2 h-4 w-4" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Program</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new fitness program.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="programName">Program Name*</Label>
                    <Input
                      id="programName"
                      name="programName"
                      value={formData.programName}
                      onChange={handleInputChange}
                      placeholder="Enter program name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="programDescription">
                      Program Description*
                    </Label>
                    <Textarea
                      id="programDescription"
                      name="programDescription"
                      value={formData.programDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your program"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="programDuration">Duration*</Label>
                    <Input
                      id="programDuration"
                      name="programDuration"
                      value={formData.programDuration}
                      onChange={handleInputChange}
                      placeholder="e.g., 8 weeks"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="programPrice">Price*</Label>
                    <Input
                      id="programPrice"
                      name="programPrice"
                      value={formData.programPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., $99.99"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Program"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="p-8 border-none shadow-sm bg-white rounded-xl">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cambridge border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="ml-4 text-gunmetal">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          isCurrentUserExpert ? (
            renderCreateFirstProgramSection()
          ) : (
            <div className="text-center py-8">
              <p className="text-timberwolf">
                This expert hasn't added any programs yet.
              </p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderProgramCards()}
          </div>
        )}
      </Card>
      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Update the details for your fitness program.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedProgram) return;

              if (
                !formData.programName ||
                !formData.programDescription ||
                !formData.programDuration ||
                !formData.programPrice
              ) {
                toast({
                  title: "Validation Error",
                  description: "Please fill in all required fields",
                  variant: "destructive",
                });
                return;
              }

              updateProgram(selectedProgram._id, formData)
                .then((response) => {
                  if (response.success) {
                    toast({
                      title: "Success",
                      description: "Program updated successfully",
                    });
                    fetchPrograms(); // Refresh the program list
                    setIsEditDialogOpen(false);
                  } else {
                    toast({
                      title: "Error",
                      description: response.error || "Failed to update program",
                      variant: "destructive",
                    });
                  }
                })
                .catch((error) => {
                  toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                  });
                });
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="programName">Program Name*</Label>
                <Input
                  id="programName"
                  name="programName"
                  value={formData.programName}
                  onChange={handleInputChange}
                  placeholder="Enter program name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programDescription">Program Description*</Label>
                <Textarea
                  id="programDescription"
                  name="programDescription"
                  value={formData.programDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your program"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programDuration">Duration*</Label>
                <Input
                  id="programDuration"
                  name="programDuration"
                  value={formData.programDuration}
                  onChange={handleInputChange}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programPrice">Price*</Label>
                <Input
                  id="programPrice"
                  name="programPrice"
                  value={formData.programPrice}
                  onChange={handleInputChange}
                  placeholder="e.g., $99.99"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramDetailsSection;
