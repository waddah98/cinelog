import Avatar from "./Avatar";
import { mockUser } from "../../../data/user";

export default {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export const WithImage = {
  args: { src: mockUser.avatar, name: mockUser.name, size: "large" },
};

// No image: the initials are shown instead.
export const Initials = {
  args: { src: "", name: "Alex Morgan", size: "large" },
};

// The image URL is broken: the component falls back to initials.
export const BrokenImage = {
  args: { src: "/images/does-not-exist.jpg", name: "Sam Lee", size: "medium" },
};

export const Small = {
  args: { src: mockUser.avatar, name: mockUser.name, size: "small" },
};
