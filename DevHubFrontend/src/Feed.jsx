import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "./utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ detects path change
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getFeed = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://devmatch-major-project.onrender.com/user/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res?.data?.data));
      } catch (err) {
        console.log("err " + err);
        // TODO: handle error properly
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ only call API when you're on the home path
    if (location.pathname === "/") {
      getFeed();
    }
  }, [location, dispatch]); // ✅ re-run this when route changes

  // Loading state with animated spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium text-white">
          Finding developers...
        </h2>
        <p className="mt-2 text-gray-400">
          Discovering your next coding partner
        </p>
      </div>
    );
  }

  // No data state
  if (!feed) {
    return null; // ⛔️ avoid returning undefined in JSX
  }

  // Empty feed state with call-to-action
  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-md p-8 mx-auto text-center bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 hover:shadow-cyan-500/5 transform hover:-translate-y-1 border border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-cyan-400 bg-cyan-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            No new developers found!
          </h2>
          <p className="mb-8 text-gray-300">
            We're searching for developers who match your interests and skills.
            Check back soon or adjust your preferences to expand your network.
          </p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button className="px-5 py-3 text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              Update Preferences
            </button>
            <button className="px-5 py-3 text-gray-300 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all duration-300 border border-slate-600">
              Invite Friends
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Populate data state
  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-6 pb-12">
      {/* Code-related background elements (decorative) */}
      {/* <div className="absolute inset-0 z-0 opacity-5 overflow-hidden">
        <div className="absolute top-1/4 left-10 text-5xl font-mono text-cyan-500">
          {"{"}
          <br />
          &nbsp;&nbsp;dev: true,
          <br />
          &nbsp;&nbsp;connect: () ={">"} {"{}"},<br />
          {"}"}
        </div>
        <div className="absolute top-2/3 right-10 text-4xl font-mono text-blue-500">
          {"<DevMatch />"}
        </div>
      </div> */}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 sm:text-4xl lg:text-5xl">
            Connect with Developers
          </h1>
          <p className="mt-3 text-xl text-gray-300">
            Find your next coding partner, mentor, or collaborator
          </p>
        </div>

        {/* Developer cards grid */}
        <div className="">
          {/* {feed.map((user, index) => (
            <div 
              key={user._id || index}
              className="transform transition-all duration-500"
              style={{ 
                opacity: 0,
                animation: `fadeIn 0.5s ease-out forwards ${index * 0.15}s`,
              }}
            > */}
          <UserCard user={feed[0]} />
          {/* </div>
          ))} */}
        </div>

        {/* Bottom action */}
      </div>
    </div>
  );
};

export default Feed;
