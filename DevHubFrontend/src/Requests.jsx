import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "./utils/requestSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]);

  const reviewRequest = async (status, _id) => {
    setProcessingIds((prev) => [...prev, _id]);

    try {
      await axios.post(
        `https://devmatch-major-project.onrender.com/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
      setError("Failed to process request");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== _id));
    }
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://devmatch-major-project.onrender.com/user/requests/recieved",
        {
          withCredentials: true,
        }
      );

      dispatch(addRequests(res.data.data));
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching requests: ", err);
      setError("Failed to load connection requests");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-16 h-16 border-t-4 border-cyan-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300">Loading connection requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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

  if (!requests || requests.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 max-w-md bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-white">
            No Connection Requests
          </h2>
          <p className="mt-2 text-gray-300">
            You don't have any pending connection requests at the moment.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
          >
            Discover Developers
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
            Connection Requests
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-gray-300 sm:text-lg">
            Developers who want to connect with you
          </p>
        </div>

        <div className="space-y-6">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } =
              request.fromUserId;
            const isProcessing = processingIds.includes(request._id);

            return (
              <div
                key={_id}
                className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-cyan-500/5 border border-slate-700"
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
                        <h2 className="text-xl font-bold text-white">
                          {firstName} {lastName}
                        </h2>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-900/50 text-cyan-300 border border-cyan-700/50">
                          Wants to Connect
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

                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      <button
                        onClick={() => reviewRequest("rejected", request._id)}
                        disabled={isProcessing}
                        className={`inline-flex items-center px-4 py-2 border border-slate-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300 ${
                          isProcessing
                            ? "opacity-50 cursor-not-allowed"
                            : "transform hover:scale-105 active:scale-95"
                        }`}
                      >
                        {isProcessing ? (
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-300"
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
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-gray-400"
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
                        )}
                        Decline
                      </button>

                      <button
                        onClick={() => reviewRequest("accepted", request._id)}
                        disabled={isProcessing}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 ${
                          isProcessing
                            ? "opacity-50 cursor-not-allowed"
                            : "transform hover:scale-105 active:scale-95"
                        }`}
                      >
                        {isProcessing ? (
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        ) : (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        Accept
                      </button>
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

export default Requests;
