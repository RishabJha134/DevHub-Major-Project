import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { removeUser } from "./utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store?.user);
  console.log("user from navbar: " + JSON.stringify(user));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await axios.post(
        "http://localhost:7777/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      dispatch(removeUser());
      navigate("/login");
      alert(response.data.message);
    } catch (err) {
      console.error("Error logging out user: ", err);
    }
  }

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          daisyUI
        </Link>
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control">Welcome, {user?.firstName}</div>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={`${user?.photoUrl}`}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/connections"}>Connections</Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
