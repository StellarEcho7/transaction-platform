import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Divider from ".";

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    sx: { height: 50 },
  },
};
