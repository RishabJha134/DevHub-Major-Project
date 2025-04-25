import axios from "axios";
import { removeFeed } from "./utils/feedSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const UserCard = ({ user = {} }) => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState("");

  // Provide default values in case `user` or its properties are undefined
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    githubUrl = "#", // Placeholder URL
  } = user;

  async function handleSendRequest(status, id) {
    // Set animation state based on status
    setAnimationType(status === "interested" ? "swipe-right" : "swipe-left");
    setIsAnimating(true);

    // Wait for animation to complete before making API call
    setTimeout(async () => {
      try {
        const response = await axios.post(
          "https://devmatch-major-project.onrender.com" + "/request/send/" + status + "/" + id,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("response from userCard: " + response);
        dispatch(removeFeed(id)); // Remove the user's feed item from the Redux store after sending the request

        // Reset animation state after API call is complete
        setIsAnimating(false);
        setAnimationType("");
      } catch (err) {
        console.log(err);
        // Reset animation state if there's an error
        setIsAnimating(false);
        setAnimationType("");
      }
    }, 400); // Duration slightly shorter than animation to ensure smooth transition
  }

 

  return (
    <div
      className={`w-full max-w-sm mx-auto overflow-hidden bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-500 transform border border-slate-700
        ${
          isAnimating && animationType === "swipe-right"
            ? "translate-x-full opacity-0"
            : ""
        }
        ${
          isAnimating && animationType === "swipe-left"
            ? "-translate-x-full opacity-0"
            : ""
        }
        ${
          !isAnimating
            ? "hover:shadow-xl hover:shadow-cyan-500/5 hover:scale-[1.02]"
            : ""
        }
      `}
      style={{
        backgroundImage:
          "radial-gradient(circle at top right, rgba(15, 23, 42, 0.8), transparent)",
      }}
    >
      {/* Profile Image with Gradient Overlay */}
      <div className="relative h-72 sm:h-80 overflow-hidden group">
        <img
          src={
            photoUrl ||
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          }
          alt={`${firstName}'s profile`}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>

        {/* Developer badge with pulse effect */}
        <div className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg flex items-center">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Developer
        </div>

        {/* GitHub link if available */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 left-4 p-2 text-white bg-slate-800/50 hover:bg-slate-800/70 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg"
            aria-label="GitHub Profile"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        )}

        {/* Name and basic info overlay with animation */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 translate-y-0 group-hover:-translate-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {`${firstName || "John"} ${lastName || "Doe"}`}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-200">
            {`${age ? age + " years" : ""} ${
              gender ? " • " + gender : ""
            } `}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* About section */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            About
          </h3>
          <p className="mt-2 text-gray-300 line-clamp-3">
            {about ||
              "Passionate developer looking to connect and collaborate on exciting projects. Always exploring new technologies and learning opportunities."}
          </p>
        </div>

        {/* Skills section with animated tags */}
        {/* <div className="mb-6">
          <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Skills
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                onClick={() => handleSkillClick(skill)}
                className="px-3 py-1 text-xs font-medium text-cyan-300 bg-slate-700/70 rounded-full transition-all duration-300 hover:bg-slate-600 hover:text-cyan-200 hover:shadow-md hover:-translate-y-1 cursor-pointer border border-slate-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div> */}

        {/* Action buttons with enhanced animations */}
        <div className="flex items-center justify-between mt-6 space-x-4">
          <button
            className="flex items-center justify-center w-full py-3 text-white bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg transition-all duration-300 hover:from-slate-700 hover:to-slate-800 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 shadow-md active:scale-95 border border-slate-600"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Pass
          </button>

          <button
            className="flex items-center justify-center w-full py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg transition-all duration-300 hover:from-cyan-600 hover:to-blue-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 shadow-md active:scale-95"
            onClick={() => handleSendRequest("interested", _id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Connect
          </button>
        </div>
      </div>

      {/* Shine effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></div>
      </div>
    </div>
  );
};

export default UserCard;
