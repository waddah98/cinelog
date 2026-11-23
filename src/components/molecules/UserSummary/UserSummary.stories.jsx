import UserSummary from "./UserSummary";
import { mockUser } from "../../../data/user";

export default {
  title: "Molecules/UserSummary",
  component: UserSummary,
};

export const Default = {
  args: { name: mockUser.name, bio: mockUser.bio, avatar: mockUser.avatar },
};

export const WithoutAvatar = {
  args: { name: "Jamie Rivera", bio: "Horror fan and late-night viewer.", avatar: "" },
};

export const WithoutBio = {
  args: { name: mockUser.name, avatar: mockUser.avatar },
};
