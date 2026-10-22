import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';


const meta = {
  title: 'Components/Forms/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { size: "M", variant: "Few Results" },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
