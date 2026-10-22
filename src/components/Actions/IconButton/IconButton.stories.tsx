import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';


const meta = {
  title: 'Components/Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon: "Search", "aria-label": "Buscar" },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
