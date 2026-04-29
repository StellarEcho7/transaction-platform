import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from ".";
import MenuItem from "../MenuItem";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Default ---
function DefaultStory() {
  const [value, setValue] = useState<number>(20);
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-select-label">Age</InputLabel>
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value as number)}
        label="Age"
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}

export const Default: Story = { render: () => <DefaultStory /> };

// --- WithValue (static, no onChange needed) ---
export const WithValue: Story = {
  render: () => (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select value={20} label="Age">
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  ),
};

// --- Disabled ---
export const Disabled: Story = {
  render: () => (
    <FormControl fullWidth disabled>
      <InputLabel id="demo-select-label">Age</InputLabel>
      <Select label="Age" value={20}>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  ),
};

// --- Outlined ---
function OutlinedStory() {
  const [value, setValue] = useState<string>("");
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-select-label">Country</InputLabel>
      <Select
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value as string)}
        label="Country"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>USA</MenuItem>
        <MenuItem value={20}>UK</MenuItem>
        <MenuItem value={30}>Germany</MenuItem>
      </Select>
    </FormControl>
  );
}

export const Outlined: Story = { render: () => <OutlinedStory /> };

// --- Multiple ---
function MultipleStory() {
  const [value, setValue] = useState<string[]>(["one", "two"]);
  return (
    <FormControl fullWidth>
      <Select
        multiple
        value={value}
        onChange={(e) =>
          setValue(Array.isArray(e.target.value) ? e.target.value : [])
        }
      >
        <MenuItem value="one">One</MenuItem>
        <MenuItem value="two">Two</MenuItem>
        <MenuItem value="three">Three</MenuItem>
      </Select>
    </FormControl>
  );
}

export const Multiple: Story = { render: () => <MultipleStory /> };
