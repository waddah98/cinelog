import Avatar from "../../atoms/Avatar/Avatar";
import "./UserSummary.css";

// Molecule: Avatar + name + short biography.
function UserSummary({ name, bio, avatar }) {
  return (
    <div className="user-summary">
      <Avatar src={avatar} name={name} size="large" />
      <div className="user-summary__text">
        <h1 className="user-summary__name">{name}</h1>
        {bio && <p className="user-summary__bio">{bio}</p>}
      </div>
    </div>
  );
}

export default UserSummary;
