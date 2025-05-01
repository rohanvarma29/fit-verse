import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await loginUser(email, password);

        if (response.success) {
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log("User logged in:", response.data);

          toast({
            title: "Success!",
            description: response.data.message,
            variant: "default",
          });

          console.log("User data:", response.data.data._id);
          // Redirect to user's profile page
          navigate(`/expert/${response.data.data._id}`);
        } else {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while logging in. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cambridge via-cambridge/80 to-cambridge/60 bg-clip-text text-transparent">
            FitVerse Expert Login
          </h2>
          <p className="mt-2 text-sm text-gunmetal/70">
            Sign in to access your expert dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                  placeholder="Enter your email"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="text-link">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Sign in
          </button>

          <p className="text-center text-sm text-gunmetal/70">
            Not registered as an expert yet?{" "}
            <Link to="/register" className="text-link">
              Create an expert account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
