import { CalendarDays, Heart } from "lucide-react";
import Badge from "../../atoms/Badge/Badge";
import UserSummary from "../../molecules/UserSummary/UserSummary";
import "./ProfileSummary.css";

// Organism: the profile header card.
// Shows the user's identity (UserSummary) plus small extra details.
// - user: the mock user object { name, bio, avatar, memberSince }
// - favoriteGenre: the genre the user watched most, or "" when there is none yet
function ProfileSummary({ user, favoriteGenre = "" }) {
  let favoriteText = "No favorite genre yet";
  if (favoriteGenre) {
    favoriteText = "Favorite genre: " + favoriteGenre;
  }

  return (
    <section className="profile-summary" aria-label="User profile">
      <UserSummary name={user.name} bio={user.bio} avatar={user.avatar} />
      <div className="profile-summary__details">
        {user.memberSince && (
          <Badge>
            <CalendarDays size={12} aria-hidden="true" /> Member since {user.memberSince}
          </Badge>
        )}
        <Badge variant="rating">
          <Heart size={12} aria-hidden="true" /> {favoriteText}
        </Badge>
      </div>
    </section>
  );
}

export default ProfileSummary;
