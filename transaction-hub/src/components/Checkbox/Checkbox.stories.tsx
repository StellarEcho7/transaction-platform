import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Checkbox from ".";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "default-checkbox",
  },
};

export const Checked: Story = {
  args: {
    name: "checked-checkbox",
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    name: "indeterminate-checkbox",
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    name: "disabled-checkbox",
    disabled: true,
  },
};


