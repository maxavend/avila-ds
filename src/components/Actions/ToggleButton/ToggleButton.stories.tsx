import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton } from './ToggleButton';


const meta = {
  title: 'Components/Actions/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: "Notificaciones", isActive: true },
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
