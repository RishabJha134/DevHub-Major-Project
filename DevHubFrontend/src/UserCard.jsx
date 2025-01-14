const UserCard = ({ user = {} }) => {
    // Provide default values in case `user` or its properties are undefined
    const {
      firstName = "Unknown",
      lastName = "",
      photoUrl = "https://via.placeholder.com/150", // Placeholder image URL
      age = "",
      gender = "",
      about = "No information provided.",
    } = user;
  
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
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserCard;
  