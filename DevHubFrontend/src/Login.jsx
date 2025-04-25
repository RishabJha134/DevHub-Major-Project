import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "./utils/userSlice";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmitLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://devmatch-major-project.onrender.com/login",
        {
          emailId: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.data));
      console.log("Login successful" + JSON.stringify(response.data));
      navigate("/");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://devmatch-major-project.onrender.com" + "/signup",
        { firstName, lastName, emailId: email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setIsLoginForm((prev) => !prev);
    setError("");
  };

  return (
    <div className="min-h-screen mt-8 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Animated code brackets logo */}
        <div className="flex justify-center mb-8 animate-pulse">
          {/* <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center transform hover:rotate-6 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div> */}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            DevMatch
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLoginForm
              ? "Sign in to connect with fellow developers"
              : "Join the developer community"}
          </p>
        </div>

        <div className="relative bg-slate-800/80 backdrop-blur-sm p-8 shadow-2xl rounded-2xl border border-slate-700 transition-all duration-500 ease-in-out transform hover:shadow-cyan-500/5">
          {/* Decorative elements */}
          <div className="absolute -right-3 -top-3 w-6 h-6 bg-cyan-500 rounded-full opacity-70"></div>
          <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-blue-600 rounded-full opacity-70"></div>

          <h3 className="text-xl font-bold text-white mb-6 text-center">
            {isLoginForm ? "Login" : "Create Account"}
          </h3>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Sign Up Fields - First Name & Last Name */}
            <div
              className={`space-y-6 ${
                isLoginForm ? "hidden" : "block animate-fadeIn"
              }`}
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  First Name
                </label>
                <div className="mt-1 relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 text-white block w-full pl-4 pr-12 py-3 rounded-lg shadow-sm transition-all duration-200"
                    placeholder="John"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 text-white block w-full pl-4 pr-12 py-3 rounded-lg shadow-sm transition-all duration-200"
                    placeholder="Doe"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 text-white block w-full pl-4 pr-12 py-3 rounded-lg shadow-sm transition-all duration-200"
                  placeholder="dev@example.com"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    isLoginForm ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-500 text-white block w-full pl-4 pr-12 py-3 rounded-lg shadow-sm transition-all duration-200"
                  placeholder={
                    isLoginForm ? "Enter password" : "Create password"
                  }
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 animate-fadeIn">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400 mr-2"
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
                  {error}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div>
              <button
                type="submit"
                onClick={isLoginForm ? handleSubmitLogin : handleSignUp}
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
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
                ) : null}
                {isLoading
                  ? "Processing..."
                  : isLoginForm
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </div>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleForm}
              className="text-sm text-cyan-400 hover:text-cyan-300 font-medium focus:outline-none focus:underline transition-colors duration-200"
            >
              {isLoginForm
                ? "New to DevMatch? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        {/* Technology badges */}
        <div className="flex justify-center space-x-4 mt-8">
          <div className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-gray-400 flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span>React</span>
          </div>
          <div className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-gray-400 flex items-center space-x-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            <span>Tailwind</span>
          </div>
          <div className="px-3 py-1 bg-slate-800/70 rounded-full text-xs text-gray-400 flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>Node.js</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
