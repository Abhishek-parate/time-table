import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { adminUpdatePassword } from "../api/api"; // Import the API call
import md5 from "crypto-js/md5"; // MD5 hashing library
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for show/hide password
import { useNavigate, Navigate, Link } from "react-router-dom";

const UpdatePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    let errors = [];
    
    if (!form.currentPassword.trim()) errors.push("Current password is required.");
    if (!form.newPassword.trim()) errors.push("New password is required.");
    if (form.newPassword === form.currentPassword)
      errors.push("New password cannot be the same as the current password.");
    if (form.newPassword !== form.confirmPassword)
      errors.push("New password and confirm password do not match.");
    if (form.newPassword.length < 6)
      errors.push("New password must be at least 6 characters long.");
    
    return errors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => toast.error(err));
      setLoading(false);
      return;
    }

    try {
      const hashedCurrentPassword = md5(form.currentPassword).toString();
      const hashedNewPassword = md5(form.newPassword).toString();

      const storedUserData = sessionStorage.getItem("user");
      if (!storedUserData) {
        toast.error("User not found in session. Please log in again.");
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUserData);
      const userID = userData.uid;
      console.log(userID);

      const data = {
        uid: userID,
        currentPassword: hashedCurrentPassword,
        newPassword: hashedNewPassword,
      };

      const response = await adminUpdatePassword("changepassword", data);

      if (response.success) {
        toast.success("Password updated successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Clear fields
        navigate("/login");

      } else {
        toast.error(response.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md shadow-lg bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Update Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label htmlFor="currentPassword" className="label">
              <span className="label-text">Current Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                className="input input-bordered w-full"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </span>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="newPassword" className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="input input-bordered w-full"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Enter a new password"
            />
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input input-bordered w-full"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
            />
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
