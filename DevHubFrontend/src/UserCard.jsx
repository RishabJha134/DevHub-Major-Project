import axios from "axios";
import { removeFeed } from "./utils/feedSlice";
import { useDispatch } from "react-redux";

const UserCard = ({ user = {} }) => {
  const dispatch = useDispatch();

  // Provide default values in case `user` or its properties are undefined
  const {
    _id,
    firstName = "Unknown",
    lastName = "",
    photoUrl = "https://via.placeholder.com/150", // Placeholder image URL
    age = "",
    gender = "",
    about = "No information provided.",
  } = user;

  async function handleSendRequest(status, id) {
    try {
      const response = await axios.post(
        "http://localhost:7777" + "/request/send/" + status + "/" + id,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("response from userCard: " + response);
      dispatch(removeFeed(id)); // Remove the user's feed item from the Redux store after sending the request
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt={`${firstName}'s photo`} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
        {age && gender && <p>{`${age}, ${gender}`}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
