import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import NumberField from ".";

const meta = {
  title: "Components/NumberField",
  component: NumberField,
  tags: ["autodocs"],
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    variant: "outlined",
  },
};

export const WithMinMax: Story = {
  args: {
    label: "Quantity",
    defaultValue: 50,
    slotProps: { htmlInput: { min: 0, max: 100 } },
    variant: "outlined",
  },
};

export const WithStep: Story = {
  args: {
    label: "Price (EUR)",
    defaultValue: 10,
    slotProps: { htmlInput: { step: 5, min: 0, max: 100 } },
    variant: "outlined",
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked Value",
    defaultValue: 25,
    disabled: true,
    variant: "outlined",
  },
};

export const WithError: Story = {
  args: {
    label: "Invalid Amount",
    defaultValue: -10,
    error: true,
    helperText: "Amount must be positive",
    variant: "outlined",
  },
};
