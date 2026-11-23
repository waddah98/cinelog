import Rating from "./Rating";

export default {
  title: "Atoms/Rating",
  component: Rating,
  argTypes: { value: { control: { type: "range", min: 0, max: 10, step: 0.1 } } },
};

export const HighRating = {
  args: { value: 9.0 },
};

export const AverageRating = {
  args: { value: 6.4 },
};

export const StarOnly = {
  args: { value: 8.1, showValue: false },
};

export const OutOfFive = {
  args: { value: 4.5, max: 5 },
};
