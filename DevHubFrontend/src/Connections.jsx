import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "./utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:7777/user/connections", {
        withCredentials: true,
      });
      console.log(
        "response from Connections component: " + JSON.stringify(res.data.data)
      );
      dispatch(addConnections(res.data.data));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load connections");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-16 h-16 border-t-4 border-cyan-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading your connections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-md max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
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
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 max-w-md bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-white">
            No Connections Yet
          </h2>
          <p className="mt-2 text-gray-300">
            Start connecting with other developers to build your network.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
          >
            Find Developers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 sm:text-4xl">
            Your Connections
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-gray-300 sm:text-lg">
            Connect, collaborate, and chat with developers in your network.
          </p>
        </div>

        <div className="space-y-6">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              connection;

            return (
              <div
                key={_id}
                className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-cyan-500/5 transform hover:scale-[1.01] border border-slate-700"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 flex items-center justify-center p-4 md:p-0">
                    <div className="h-24 w-24 md:h-full md:w-32 lg:w-48 relative overflow-hidden">
                      <img
                        className="h-full w-full object-cover"
                        src={
                          photoUrl || "/placeholder.svg?height=200&width=200"
                        }
                        alt={`${firstName}'s profile`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent"></div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center">
                          {firstName} {lastName}
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-green-400"></span>
                        </h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/50 text-cyan-300 border border-cyan-700/50">
                          Developer
                        </span>
                      </div>

                      {age && gender && (
                        <p className="mt-1 text-sm text-gray-400">
                          {age} years • {gender}
                        </p>
                      )}

                      <p className="mt-3 text-gray-300 line-clamp-2">
                        {about || "No bio available"}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                      <Link
                        to={`/chat/${_id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Chat Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
