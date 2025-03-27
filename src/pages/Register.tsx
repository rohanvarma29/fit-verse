import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, Calendar, Link2, ListOrdered, ListCheck, Book } from "lucide-react";
import { registerUser } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Form steps
const steps = [
  { id: "personal", label: "Personal Info" },
  { id: "profile", label: "Profile Details" },
  { id: "programs", label: "Program Details" },
  { id: "faqs", label: "FAQs" },
  { id: "availability", label: "Availability" },
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Profile Details
    displayName: "",
    location: "",
    bio: "",
    socialMedia: "",
    
    // Program Details
    programDescription: "",
    programDuration: "",
    programPrice: "",
    programHighlights: "",
    
    // FAQs
    faqs: [{ question: "", answer: "" }],
    
    // Availability
    availability: {
      monday: [{ startTime: "", endTime: "" }],
      tuesday: [{ startTime: "", endTime: "" }],
      wednesday: [{ startTime: "", endTime: "" }],
      thursday: [{ startTime: "", endTime: "" }],
      friday: [{ startTime: "", endTime: "" }],
      saturday: [{ startTime: "", endTime: "" }],
      sunday: [{ startTime: "", endTime: "" }],
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    const currentStepId = steps[currentStep].id;

    if (currentStepId === "personal") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    if (currentStepId === "profile") {
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Display name is required";
      }
      
      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
      }
      
      if (!formData.bio.trim()) {
        newErrors.bio = "Bio is required";
      }
    }
    
    if (currentStepId === "programs") {
      if (!formData.programDescription.trim()) {
        newErrors.programDescription = "Program description is required";
      }
      
      if (!formData.programDuration.trim()) {
        newErrors.programDuration = "Program duration is required";
      }
      
      if (!formData.programPrice.trim()) {
        newErrors.programPrice = "Program price is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFAQs = [...formData.faqs];
    updatedFAQs[index] = { ...updatedFAQs[index], [field]: value };
    
    setFormData((prev) => ({
      ...prev,
      faqs: updatedFAQs,
    }));
  };
  
  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };
  
  const removeFAQ = (index: number) => {
    if (formData.faqs.length > 1) {
      const updatedFAQs = [...formData.faqs];
      updatedFAQs.splice(index, 1);
      
      setFormData((prev) => ({
        ...prev,
        faqs: updatedFAQs,
      }));
    }
  };
  
  const handleAvailabilityChange = (day: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    const updatedAvailability = { ...formData.availability };
    updatedAvailability[day as keyof typeof formData.availability][index] = {
      ...updatedAvailability[day as keyof typeof formData.availability][index],
      [field]: value
    };
    
    setFormData((prev) => ({
      ...prev,
      availability: updatedAvailability,
    }));
  };
  
  const addTimeSlot = (day: string) => {
    const updatedAvailability = { ...formData.availability };
    updatedAvailability[day as keyof typeof formData.availability].push({ startTime: "", endTime: "" });
    
    setFormData((prev) => ({
      ...prev,
      availability: updatedAvailability,
    }));
  };
  
  const removeTimeSlot = (day: string, index: number) => {
    const slots = formData.availability[day as keyof typeof formData.availability];
    
    if (slots.length > 1) {
      const updatedAvailability = { ...formData.availability };
      updatedAvailability[day as keyof typeof formData.availability].splice(index, 1);
      
      setFormData((prev) => ({
        ...prev,
        availability: updatedAvailability,
      }));
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await registerUser(formData);

      if (response && response.success) {
        toast({
          title: "Success",
          description: response.message || "Registration successful",
          variant: "default",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: response?.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;

    if (currentStepId === "personal") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                {errors.firstName && (
                  <span className="form-error">{errors.firstName}</span>
                )}
              </div>
              <div className="input-group group">
                <div className="input-icon">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.firstName ? "border-destructive" : ""
                  }`}
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                {errors.lastName && (
                  <span className="form-error">{errors.lastName}</span>
                )}
              </div>
              <div className="input-group group">
                <div className="input-icon">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input pl-10 ${
                    errors.lastName ? "border-destructive" : ""
                  }`}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>
            <div className="input-group group">
              <div className="input-icon">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input pl-10 ${
                  errors.email ? "border-destructive" : ""
                }`}
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>
            <div className="input-group group">
              <div className="input-icon">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`form-input pl-10 ${
                  errors.password ? "border-destructive" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>
            <div className="input-group group">
              <div className="input-icon">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input pl-10 ${
                  errors.confirmPassword ? "border-destructive" : ""
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentStepId === "profile") {
      return (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="displayName" className="form-label">
                Display Name
              </label>
              {errors.displayName && (
                <span className="form-error">{errors.displayName}</span>
              )}
            </div>
            <div className="input-group group">
              <div className="input-icon">
                <User className="h-5 w-5" />
              </div>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                className={`form-input pl-10 ${
                  errors.displayName ? "border-destructive" : ""
                }`}
                placeholder="How clients will see your name"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              {errors.location && (
                <span className="form-error">{errors.location}</span>
              )}
            </div>
            <div className="input-group">
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className={`form-input ${
                  errors.location ? "border-destructive" : ""
                }`}
                placeholder="City, State"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              {errors.bio && (
                <span className="form-error">{errors.bio}</span>
              )}
            </div>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`form-input resize-none ${
                errors.bio ? "border-destructive" : ""
              }`}
              placeholder="Tell potential clients about yourself (training experience, certifications, specialties)"
              rows={4}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="socialMedia" className="form-label">
                Social Media Links
              </label>
            </div>
            <div className="input-group group">
              <div className="input-icon">
                <Link2 className="h-5 w-5" />
              </div>
              <input
                id="socialMedia"
                name="socialMedia"
                type="text"
                value={formData.socialMedia}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="Instagram handle (optional)"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label">Profile Photo</label>
            </div>
            <div className="mt-2">
              <label className="flex flex-col items-center px-4 py-6 bg-alabaster border-2 border-dashed border-timberwolf rounded-lg cursor-pointer hover:bg-timberwolf/20 transition-colors duration-200">
                <User className="w-10 h-10 text-cambridge mb-2" />
                <span className="text-sm text-gunmetal/70">Click to upload profile photo</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentStepId === "programs") {
      return (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="programDescription" className="form-label">
                Program Description
              </label>
              {errors.programDescription && (
                <span className="form-error">{errors.programDescription}</span>
              )}
            </div>
            <Textarea
              id="programDescription"
              name="programDescription"
              value={formData.programDescription}
              onChange={handleChange}
              className={`form-input resize-none ${
                errors.programDescription ? "border-destructive" : ""
              }`}
              placeholder="Describe your program in detail"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="programDuration" className="form-label">
                  Program Duration
                </label>
                {errors.programDuration && (
                  <span className="form-error">{errors.programDuration}</span>
                )}
              </div>
              <div className="input-group">
                <input
                  id="programDuration"
                  name="programDuration"
                  type="text"
                  value={formData.programDuration}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.programDuration ? "border-destructive" : ""
                  }`}
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="programPrice" className="form-label">
                  Program Price
                </label>
                {errors.programPrice && (
                  <span className="form-error">{errors.programPrice}</span>
                )}
              </div>
              <div className="input-group">
                <input
                  id="programPrice"
                  name="programPrice"
                  type="text"
                  value={formData.programPrice}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.programPrice ? "border-destructive" : ""
                  }`}
                  placeholder="e.g., $199"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="programHighlights" className="form-label">
                Program Highlights
              </label>
            </div>
            <Textarea
              id="programHighlights"
              name="programHighlights"
              value={formData.programHighlights}
              onChange={handleChange}
              className="form-input resize-none"
              placeholder="Key benefits of your program (separate by new lines)"
              rows={3}
            />
          </div>
        </div>
      );
    }
    
    if (currentStepId === "faqs") {
      return (
        <div className="space-y-6">
          <p className="text-sm text-gunmetal/70">
            Add frequently asked questions that potential clients might have about your services.
          </p>
          
          {formData.faqs.map((faq, index) => (
            <div key={index} className="space-y-3 p-4 border border-timberwolf rounded-lg bg-alabaster/50">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">FAQ #{index + 1}</h3>
                {formData.faqs.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-xs text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor={`faq-question-${index}`} className="form-label">
                    Question
                  </label>
                </div>
                <div className="input-group">
                  <input
                    id={`faq-question-${index}`}
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                    className="form-input"
                    placeholder="e.g., How long are your sessions?"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor={`faq-answer-${index}`} className="form-label">
                    Answer
                  </label>
                </div>
                <Textarea
                  id={`faq-answer-${index}`}
                  value={faq.answer}
                  onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                  className="form-input resize-none"
                  placeholder="Provide your answer here"
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFAQ}
            className="w-full py-2 border border-dashed border-cambridge text-cambridge rounded-lg hover:bg-cambridge/5 transition-colors"
          >
            + Add Another FAQ
          </button>
        </div>
      );
    }
    
    if (currentStepId === "availability") {
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      
      return (
        <div className="space-y-6">
          <p className="text-sm text-gunmetal/70">
            Set your weekly availability for client sessions.
          </p>
          
          <div className="space-y-6">
            {days.map((day) => (
              <div key={day} className="space-y-3 p-4 border border-timberwolf rounded-lg bg-alabaster/50">
                <h3 className="text-sm font-medium capitalize">{day}</h3>
                
                {formData.availability[day as keyof typeof formData.availability].map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label htmlFor={`${day}-start-${index}`} className="form-label text-xs">
                        Start Time
                      </label>
                      <input
                        id={`${day}-start-${index}`}
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleAvailabilityChange(day, index, 'startTime', e.target.value)}
                        className="form-input py-2"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label htmlFor={`${day}-end-${index}`} className="form-label text-xs">
                        End Time
                      </label>
                      <input
                        id={`${day}-end-${index}`}
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleAvailabilityChange(day, index, 'endTime', e.target.value)}
                        className="form-input py-2"
                      />
                    </div>
                    
                    {formData.availability[day as keyof typeof formData.availability].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(day, index)}
                        className="mt-5 text-destructive hover:text-destructive/80"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addTimeSlot(day)}
                  className="text-xs text-cambridge hover:text-cambridge/80"
                >
                  + Add Time Slot
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-gunmetal text-alabaster w-full md:w-2/5 p-8 flex flex-col justify-center fixed md:h-screen left-0 top-0">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cambridge via-cambridge/80 to-cambridge/60 bg-clip-text text-transparent">
            Become a FitVerse Expert
          </h1>
          
          <p className="text-alabaster/90 text-lg">
            Set up your expert profile and reach thousands of potential clients looking for fitness and wellness professionals.
          </p>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-start space-x-3">
              <div className="bg-cambridge/20 p-2 rounded-full mt-1">
                <ListCheck className="h-5 w-5 text-cambridge" />
              </div>
              <div>
                <h3 className="font-medium text-alabaster">Build Your Brand</h3>
                <p className="text-sm text-alabaster/70">Create a professional profile showcasing your expertise and services</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-cambridge/20 p-2 rounded-full mt-1">
                <Calendar className="h-5 w-5 text-cambridge" />
              </div>
              <div>
                <h3 className="font-medium text-alabaster">Flexible Scheduling</h3>
                <p className="text-sm text-alabaster/70">Set your own availability and manage bookings efficiently</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-cambridge/20 p-2 rounded-full mt-1">
                <Book className="h-5 w-5 text-cambridge" />
              </div>
              <div>
                <h3 className="font-medium text-alabaster">Share Your Knowledge</h3>
                <p className="text-sm text-alabaster/70">Offer personalized programs and build lasting client relationships</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-alabaster w-full md:w-3/5 min-h-screen md:ml-[40%]">
        <ScrollArea className="h-screen p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-2xl mx-auto space-y-8 pb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gunmetal/60">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{steps[currentStep].label}</span>
              </div>
              <Progress value={progress} className="h-2 bg-timberwolf" />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gunmetal">
                {steps[currentStep].label}
              </h2>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {renderStepContent()}
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={`px-6 py-2.5 border border-timberwolf rounded-lg text-gunmetal hover:bg-timberwolf/20 transition-colors ${
                      currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary max-w-xs"
                  >
                    {currentStep === steps.length - 1 ? "Complete Setup" : "Next Step"}
                  </button>
                </div>
              </form>
              
              <p className="text-center text-sm text-gunmetal/70">
                Already have an expert account?{" "}
                <Link to="/login" className="text-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Register;
