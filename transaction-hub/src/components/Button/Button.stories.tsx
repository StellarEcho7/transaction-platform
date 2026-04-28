import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from ".";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: { type: "select" },
      options: ["primary", "secondary", "error", "info", "success", "warning"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "contained",
    color: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "contained",
    color: "secondary",
  },
};

export const Outlined: Story = {
  args: {
    children: "Outlined Button",
    variant: "outlined",
    color: "primary",
  },
};

export const Text: Story = {
  args: {
    children: "Text Button",
    variant: "text",
    color: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};
