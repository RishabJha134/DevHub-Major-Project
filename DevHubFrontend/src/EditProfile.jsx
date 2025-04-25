import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import { useNavigate } from "react-router";

const EditProfile = ({ user }) => {
  const navigate = useNavigate();
  console.log("User from EditProfile:", JSON.stringify(user));

  const { firstName, lastName, photoUrl, age, gender, about } = user;

  // State variables
  const [firstNames, setFirstNames] = useState(firstName);
  const [lastNames, setLastNames] = useState(lastName);
  const [photoUrls, setPhotoUrls] = useState(photoUrl);
  const [photoFile, setPhotoFile] = useState(null); // For storing the file
  const [ages, setAges] = useState(age || "");
  const [genders, setGenders] = useState(gender || ""); // Default to current gender
  const [abouts, setAbouts] = useState(about);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic"); // For tab navigation

  const dispatch = useDispatch();

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoUrls(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Save profile handler
  const saveProfile = async () => {
    setError(""); // Clear existing errors
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstNames);
      formData.append("lastName", lastNames);
      formData.append("photoFile", photoFile); // Append file
      formData.append("age", ages);
      formData.append("gender", genders);
      formData.append("about", abouts);

      const res = await axios.patch(
        "http://localhost:7777/profile/edit",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(addUser(res?.data?.data)); // Update Redux store
      setShowToast(true); // Show success toast
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      navigate("/");
    } catch (err) {
      console.log("Error from edit profile:", err);
      setError(
        err?.response?.data?.error ||
          "An error occurred while saving the profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 sm:text-4xl">
            Edit Your Developer Profile
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-gray-300 sm:text-lg">
            Customize your profile to stand out and connect with other
            developers who share your interests.
          </p>
        </div>

        <div className="flex  flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full  h-[79vh] lg:w-1/2 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/5 transform hover:scale-[1.01] border border-slate-700">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-700">
              <button
                className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors duration-200 ${
                  activeSection === "basic"
                    ? "text-cyan-400 border-b-2 border-cyan-500"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveSection("basic")}
              >
                Basic Info
              </button>
              <button
                className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors duration-200 ${
                  activeSection === "about"
                    ? "text-cyan-400 border-b-2 border-cyan-500"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveSection("about")}
              >
                About You
              </button>
              <button
                className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors duration-200 ${
                  activeSection === "photo"
                    ? "text-cyan-400 border-b-2 border-cyan-500"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setActiveSection("photo")}
              >
                Photo
              </button>
            </div>

            <div className="p-6">
              {/* Basic Info Section */}
              <div className={activeSection === "basic" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstNames}
                      onChange={(e) => setFirstNames(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastNames}
                      onChange={(e) => setLastNames(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                      placeholder="Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={ages}
                      onChange={(e) => setAges(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={genders}
                      onChange={(e) => setGenders(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className={activeSection === "about" ? "block" : "hidden"}>
                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-300"
                  >
                    About You
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      rows={6}
                      value={abouts}
                      onChange={(e) => setAbouts(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-200"
                      placeholder="Tell other developers about yourself, your skills, interests, and what you're looking to collaborate on..."
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Brief description for your profile. URLs are hyperlinked.
                  </p>
                </div>
              </div>

              {/* Photo Section */}
              <div className={activeSection === "photo" ? "block" : "hidden"}>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Profile Photo
                  </label>
                  <div className="mt-1 flex items-center space-x-5">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-slate-700 border-2 border-cyan-500/30">
                        {photoUrls ? (
                          <img
                            src={photoUrls || "/placeholder.svg"}
                            alt="Profile Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="photo-upload"
                        className="relative cursor-pointer bg-slate-700 px-4 py-2 rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none transition-colors duration-200"
                      >
                        <span>Upload a file</span>
                        <input
                          id="photo-upload"
                          name="photo-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-slate-800 text-sm text-gray-400">
                        or
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="photo-url"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Photo URL
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="photo-url"
                        id="photo-url"
                        className="focus:ring-cyan-500 focus:border-cyan-500 flex-1 block w-full rounded-md sm:text-sm border-slate-600 bg-slate-700/50 text-white transition-all duration-200"
                        placeholder="https://example.com/your-photo.jpg"
                        value={photoFile ? "" : photoUrls || ""}
                        onChange={(e) => {
                          setPhotoUrls(e.target.value);
                          setPhotoFile(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-md bg-red-900/50 border border-red-500 p-4 animate-fade-in-down">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading
                      ? "bg-cyan-600/70"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-95`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                {activeSection !== "basic" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSection === "about") setActiveSection("basic");
                      if (activeSection === "photo") setActiveSection("about");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-slate-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                )}

                {activeSection !== "photo" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSection === "basic") setActiveSection("about");
                      if (activeSection === "about") setActiveSection("photo");
                    }}
                    className={`${
                      activeSection === "basic" ? "ml-auto" : ""
                    } inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200`}
                  >
                    Next
                    <svg
                      className="ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
              Profile Preview
            </h2>
            <div className="w-full max-w-sm">
              <UserCard
                user={{
                  firstName: firstNames,
                  lastName: lastNames,
                  photoUrl: photoUrls,
                  age: ages,
                  gender: genders,
                  about: abouts,
                }}
              />
            </div>
            <p className="mt-4 text-sm text-gray-400 text-center max-w-xs">
              This is how your profile will appear to other developers on
              DevMatch.
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className="bg-green-900/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border-l-4 border-green-500 flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-300">
                Profile saved successfully!
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowToast(false)}
                  className="inline-flex bg-green-800/50 rounded-md p-1.5 text-green-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
