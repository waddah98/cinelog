import { CheckCircle } from "lucide-react";
import StatCard from "./StatCard";

export default {
  title: "Molecules/StatCard",
  component: StatCard,
  argTypes: { icon: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    label: "Watched",
    value: 12,
    icon: <CheckCircle size={18} aria-hidden="true" />,
    description: "Movies you have finished",
  },
};

export const ZeroValue = {
  args: {
    label: "Watched",
    value: 0,
    icon: <CheckCircle size={18} aria-hidden="true" />,
    description: "Movies you have finished",
  },
};

export const WithoutIcon = {
  args: { label: "Planned", value: 5 },
};
