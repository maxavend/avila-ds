import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconToggleButton } from './IconToggleButton';


const meta = {
  title: 'Components/Actions/IconToggleButton',
  component: IconToggleButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon: "Heart", "aria-label": "Marcar favorito" },
} satisfies Meta<typeof IconToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
