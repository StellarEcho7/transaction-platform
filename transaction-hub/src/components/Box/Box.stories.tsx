import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Box from ".";

const meta = {
  title: "Components/Box",
  component: Box,
  tags: ["autodocs"],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sx: {
      p: 2,
      bgcolor: "primary.light",
      color: "primary.contrastText",
      borderRadius: 1,
    },
    children: "Default Box",
  },
};

export const CustomLayout: Story = {
  args: {
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 100,
      bgcolor: "success.light",
      color: "success.contrastText",
      borderRadius: 2,
    },
    children: "Custom Layout Box",
  },
};
