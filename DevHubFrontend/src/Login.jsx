import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addUser } from "./utils/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    dispatch(addUser(response.data));
    console.log("Login successful" + JSON.stringify(response.data));
    navigate("/");
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <div className="hero bg-base-100 ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={(e) => handleSubmitLogin(e)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
