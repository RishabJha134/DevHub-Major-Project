import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import axios from "axios";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function fetchUserDetails() {
    try {
      const result = await axios.get("http://localhost:7777/profile/view", {
        withCredentials: true,
      });
      console.log(result);

      dispatch(addUser(result.data));
    } catch (err) {
      console.log("err" + err.status);
      if (err.status === 401) {
        navigate("/login"); // redirect to login page if user is not logged in
      } else {
        console.log("Error fetching user details: ", err);
      }
    }
  }
  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default Body;
