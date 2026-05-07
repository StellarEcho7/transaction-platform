import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Alert from ".";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is an alert message",
    severity: "info",
  },
};

export const Error: Story = {
  args: {
    children: "This is an error alert",
    severity: "error",
  },
};

export const Success: Story = {
  args: {
    children: "This is a success alert",
    severity: "success",
  },
};