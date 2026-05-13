import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Paper from ".";

const meta = {
  title: "Components/Paper",
  component: Paper,
  tags: ["autodocs"],
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Paper Content",
    elevation: 0,
    sx: { p: 2 },
  },
};

export const Elevated: Story = {
  args: {
    children: "Elevated Paper",
    elevation: 2,
    sx: { p: 2 },
  },
};
