import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";

const EditProfile = ({ user }) => {
  console.log("User from EditProfile:", JSON.stringify(user));

  const { firstName, lastName, photoUrl, age, gender, about } = user;

  // State variables
  const [firstNames, setFirstNames] = useState(firstName);
  const [lastNames, setLastNames] = useState(lastName);
  const [photoUrls, setPhotoUrls] = useState(photoUrl);
  const [photoFile, setPhotoFile] = useState(null); // For storing the file
  const [ages, setAges] = useState(age || "");
  const [genders, setGenders] = useState(gender || ""); // Default to current gender
  const [abouts, setAbouts] = useState(about);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoUrls(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // Save profile handler
  const saveProfile = async () => {
    setError(""); // Clear existing errors
    try {
      const formData = new FormData();
      formData.append("firstName", firstNames);
      formData.append("lastName", lastNames);
      formData.append("photoFile", photoFile); // Append file
      formData.append("age", ages);
      formData.append("gender", genders);
      formData.append("about", abouts);

      const res = await axios.patch(
        "http://localhost:7777/profile/edit",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(addUser(res?.data?.data)); // Update Redux store
      setShowToast(true); // Show success toast
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    } catch (err) {
      console.log("Error from edit profile:", err);
      setError(
        err?.response?.data?.error ||
          "An error occurred while saving the profile."
      );
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstNames}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstNames(e.target.value)}
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastNames}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastNames(e.target.value)}
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Profile Picture:</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full max-w-xs"
                    onChange={handleFileChange}
                  />
                  {/* {photoUrls && (
                    <div className="mt-3">
                      <img
                        src={photoUrls}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )} */}
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="number"
                    value={ages}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setAges(e.target.value)}
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender:</span>
                  </div>
                  <select
                    value={genders}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setGenders(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <textarea
                    value={abouts}
                    className="textarea textarea-bordered w-full max-w-xs"
                    onChange={(e) => setAbouts(e.target.value)}
                  />
                </label>
              </div>

              <p className="text-red-500">{error}</p>

              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <UserCard
          user={{
            firstName: firstNames,
            lastName: lastNames,
            photoUrl: photoUrls,
            age: ages,
            gender: genders,
            about: abouts,
          }}
        />
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
