import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "./utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import { useLocation } from "react-router-dom"; // ✅ important

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ detects path change

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get("http://localhost:7777/user/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res?.data?.data));
      } catch (err) {
        console.log("err " + err);
        // TODO: handle error properly
      }
    };

    // ✅ only call API when you're on the home path
    if (location.pathname === "/") {
      getFeed();
    }
  }, [location, dispatch]); // ✅ re-run this when route changes

  if (!feed) {
    return null; // ⛔️ avoid returning undefined in JSX
  }

  if (feed.length === 0) {
    return <h1 className="flex justify-center my-10">No new users found!</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
