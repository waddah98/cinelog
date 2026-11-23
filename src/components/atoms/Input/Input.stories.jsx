import { fn } from "storybook/test";
import Input from "./Input";

export default {
  title: "Atoms/Input",
  component: Input,
  args: { id: "story-input", label: "Movie title", value: "", onChange: fn(), placeholder: "Type a title..." },
};

export const Default = {};

export const WithValue = {
  args: { value: "Inception" },
};

export const Error = {
  args: { value: "", error: "Please enter a movie title." },
};

export const HiddenLabel = {
  args: { hideLabel: true, placeholder: "The label is only read by screen readers" },
};
