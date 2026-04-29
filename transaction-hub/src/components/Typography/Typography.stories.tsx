import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Typography from ".";

const meta = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    children: "Heading 1 - Bold and Large Text",
    variant: "h1",
  },
};

export const H2: Story = {
  args: {
    children: "Heading 2 - Section Title",
    variant: "h2",
  },
};

export const H3: Story = {
  args: {
    children: "Heading 3 - Subsection Title",
    variant: "h3",
  },
};

export const Body1: Story = {
  args: {
    children:
      "Body 1 - Standard paragraph text used for general content. This demonstrates the default typography variant with proper line height and font size.",
  },
};

export const Body2: Story = {
  args: {
    children:
      "Body 2 - Slightly smaller text for secondary information, captions, or less prominent content sections in the interface.",
  },
};

export const Caption: Story = {
  args: {
    children: "Caption - Small descriptive text for additional context",
    variant: "caption",
  },
};

export const Overline: Story = {
  args: {
    children: "OVERLINE - Uppercase label-style text",
    variant: "overline",
  },
};

export const PrimaryColor: Story = {
  args: {
    children: "Primary color text using theme.palette.primary.main",
    color: "primary",
  },
};

export const SecondaryColor: Story = {
  args: {
    children: "Secondary color for emphasis or warnings",
    color: "secondary",
  },
};

export const ErrorColor: Story = {
  args: {
    children: "Error state text in red",
    color: "error",
  },
};

export const SuccessColor: Story = {
  args: {
    children: "Success confirmation message in green",
    color: "success",
  },
};

export const GutterTop: Story = {
  args: {
    children: "Paragraph with gutterBottom spacing below",
    variant: "body1",
    gutterBottom: true,
  },
};

export const NoWrap: Story = {
  args: {
    children:
      "This text will not wrap even in a narrow container using noWrap prop to keep everything on one line with ellipsis",
    noWrap: true,
  },
};
