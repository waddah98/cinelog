import ProfileSummary from "./ProfileSummary";
import { mockUser } from "../../../data/user";

export default {
  title: "Organisms/ProfileSummary",
  component: ProfileSummary,
  tags: ["autodocs"],
  args: { user: mockUser },
};

export const WithFavoriteGenre = {
  args: { favoriteGenre: "Sci-Fi" },
};

export const NoActivityYet = {
  args: { favoriteGenre: "" },
};
