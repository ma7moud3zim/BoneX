import React, { useEffect, useState } from "react";
import AvatarMale from "./images/avatar-male.jpg";
import AvatarFemale from "./images/avatarfm.webp";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    height: "",
    bodyWeight: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = window.sessionStorage.getItem("UserInfo");
    if (data) {
      const res = JSON.parse(data);
      setUser(res);
      setFormData({
        name: res.userName || "",
        gender: res.gender || "",
        dateOfBirth: res.dateOfBirth || "",
        mobile: res.mobile || "",
        email: res.email || "",
        bloodGroup: res.bloodGroup || "",
        height: res.height || "",
        bodyWeight: res.bodyWeight || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add logic to handle form submission
  };

  return (
    <div className="min-h-screen bg-[#EBF4F6] flex items-center justify-center py-10">
      <div className="bg-white p-6 shadow-sm rounded-lg max-w-[900px] w-full">
        <h2 className="text-center text-xl font-semibold text-[#071952] my-4">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="md:flex md:space-x-6">
          {/* Left column: Form Fields */}
          <div className="md:w-2/3 space-y-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Gender */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3 flex space-x-4">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <span className="text-[#071952]">Male</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  />
                  <span className="text-[#071952]">Female</span>
                </label>
              </div>
            </div>
            {/* Date of Birth */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Mobile */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Mobile <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3 flex space-x-2">
                <select className="rounded-full shadow-sm border border-[#37B7C3] py-2 px-3">
                  <option>Egypt (+20)</option>
                  {/* Add more country code options as needed */}
                </select>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || user?.phoneNumber || ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Email */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Blood Group */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">Blood Group</label>
              <div className="col-span-3">
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                >
                  <option>Choose your blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
            {/* Height */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Height <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3">
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Enter height in cm"
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Body Weight */}
            <div className="grid grid-cols-4 items-center">
              <label className="text-[#071952] font-medium">
                Body Weight <span className="text-red-500">*</span>
              </label>
              <div className="col-span-3">
                <input
                  type="number"
                  name="bodyWeight"
                  value={formData.bodyWeight}
                  onChange={handleChange}
                  placeholder="Enter weight in kg"
                  required
                  className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="bg-[#088395] border border-[#088395] text-white rounded-full px-6 py-2 text-sm"
              >
                Submit
              </button>
            </div>
            {/* Links */}
            <div className="text-center mt-2">
              <a href="#" className="text-gray-500 hover:underline">
                Download Data
              </a>{" "}
              |{" "}
              <a href="#" className="text-gray-500 hover:underline">
                Delete Account
              </a>
            </div>
          </div>
          {/* Right column: Profile Image and File Upload */}
          <div className="md:w-1/3 mt-6 md:mt-0 flex flex-col items-center">
            <img
              src={
                profileImage ||
                (user && user.gender === "Female" ? AvatarFemale : AvatarMale)
              }
              alt="Profile"
              className="mb-3 rounded-full object-cover shadow"
              style={{ width: "150px", height: "150px" }}
            />
            <div className="w-full">
              <label className="block text-[#071952] mb-2">
                Upload Profile Picture
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full rounded-full shadow-sm border border-[#37B7C3] py-2 px-4"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
