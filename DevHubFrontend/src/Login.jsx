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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmitLogin(e) {
    //Handle form submission here
    e.preventDefault(); // Prevent form from refreshing the page

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    console.log(
      "Login submitted with email: ",
      email,
      " and password: ",
      password
    );

    //Make API call to login endpoint with provided email and password

    try {
      const response = await axios.post(
        "http://localhost:7777/login",
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
      setError(err?.response?.data?.message || "something went wrong");
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        "http://localhost:7777" + "/signup",
        { firstName, lastName, emailId: email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">
              {isLoginForm ? "Login" : "Sign Up"}
            </h2>
            <div>
              {!isLoginForm && (
                <>
                  <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text">First Name</span>
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                  <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text">Last Name</span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </>
              )}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Email ID:</span>
                </div>
                <input
                  type="text"
                  value={email}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input
                  type="password"
                  value={password}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <p className="text-red-500">{error}</p>
            <div className="card-actions justify-center m-2">
              <button
                className="btn btn-primary"
                onClick={isLoginForm ? handleSubmitLogin : handleSignUp}
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>

            <p
              className="m-auto cursor-pointer py-2"
              onClick={() => setIsLoginForm((value) => !value)}
            >
              {isLoginForm
                ? "New User? Signup Here"
                : "Existing User? Login Here"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
