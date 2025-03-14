import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Changepassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShowCard(true); // Trigger animation on mount
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
    } else if (newPassword === oldPassword) {
      setMessage("The new Password Should be not equal the old password.");
    } else {
      // Add password change logic here
      axios
        .put(
          "https://localhost:7294/api/Patient/reset-password",
          {
            currentPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setMessage("Password changed successfully");
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data);
        });
    }
  };

  return (
    <div className="mt-5 container mx-auto px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div
            className={`rounded-lg p-6 shadow-sm bg-[#f9f9f9] transition-opacity duration-500 ${
              showCard ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-center text-2xl font-bold mb-4">
              Change Your Password
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Use the form below to update your password
            </p>

            {message && (
              <div
                className={`text-center py-2 mb-4 rounded ${
                  message === "Password changed successfully"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Old Password */}
              <div className="mb-4">
                <label
                  htmlFor="oldPassword"
                  className="block text-gray-700 mb-1"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#37B7C3]"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#37B7C3]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-0 mt-2 mr-3 p-0 focus:outline-none"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={{ color: "#37B7C3", fontSize: "1.2rem" }}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#37B7C3]"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-0 mt-2 mr-3 p-0 focus:outline-none"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={{ color: "#37B7C3", fontSize: "1.2rem" }}
                    />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full mt-3 rounded-full px-4 py-2 text-white bg-[#088395] border border-[#088395] focus:outline-none hover:bg-[#077a80]"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
