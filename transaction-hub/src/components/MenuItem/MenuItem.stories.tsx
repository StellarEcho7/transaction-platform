import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MenuItem from ".";

const meta = {
  title: "Components/MenuItem",
  component: MenuItem,
  tags: ["autodocs"],
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Item",
  },
};

export const Selected: Story = {
  args: {
    children: "Selected Item",
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Item",
    disabled: true,
  },
};

export const WithDivider: Story = {
  args: {
    children: "Item with Divider",
    divider: true,
  },
};
