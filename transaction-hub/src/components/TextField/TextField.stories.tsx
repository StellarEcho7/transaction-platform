import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TextField from ".";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default TextField",
    placeholder: "Enter text...",
  },
};

export const Outlined: Story = {
  args: {
    label: "Outlined TextField",
    placeholder: "Outlined variant",
    variant: "outlined",
  },
};

export const Standard: Story = {
  args: {
    label: "Standard TextField",
    placeholder: "Standard variant",
    variant: "standard",
  },
};

export const WithError: Story = {
  args: {
    label: "Error Field",
    value: "Invalid input",
    error: true,
    helperText: "This field has an error",
  },
};

export const Multiline: Story = {
  args: {
    label: "Multiline TextField",
    placeholder: "Enter multiple lines...",
    multiline: true,
    rows: 4,
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    value: "Cannot edit",
    disabled: true,
  },
};
