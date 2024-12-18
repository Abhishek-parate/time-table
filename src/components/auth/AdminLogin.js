import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { adminLogin } from "../../api/api";
import md5 from "crypto-js/md5"; // Import the MD5 hashing library
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const navigate = useNavigate();

  // Helper function for username validation
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Only alphanumeric and underscores allowed
    return usernameRegex.test(username);
  };

  // Helper function for password validation
  const validatePassword = (password) => {
    const passwordMinLength = 6;
    return password.length >= passwordMinLength;
  };

  const validateForm = () => {
    let errors = [];

    if (!form.username.trim()) {
      errors.push("Username is required.");
    }
    if (!validateUsername(form.username)) {
      errors.push("Username can only contain letters, numbers, and underscores.");
    }
    if (!form.password.trim()) {
      errors.push("Password is required.");
    }
    if (!validatePassword(form.password)) {
      errors.push(`Password must be at least 6 characters long.`);
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => toast.error(err)); // Display all errors as toast notifications
      setLoading(false);
      return;
    }

    try {
      // Hash the password using MD5
      const hashedPassword = md5(form.password).toString();
      const response = await adminLogin("login", {
        username: form.username,
        password: hashedPassword, // Send the hashed password
      });

      if (response.success) {
        const userData = response.data; // Adjust based on actual response structure
        // Store session data after login
        sessionStorage.setItem("user", JSON.stringify(userData)); // Store the entire user object
        toast.success("Login successful!");
        navigate("/home"); // Redirect to home after login
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to fetch. Please try again later.");
      toast.error("Failed to fetch. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md shadow-lg bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Login
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label htmlFor="username" className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="input input-bordered w-full"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                id="password"
                name="password"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
