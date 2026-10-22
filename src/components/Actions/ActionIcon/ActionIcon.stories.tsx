import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionIcon } from './ActionIcon';


const meta = {
  title: 'Components/Actions/ActionIcon',
  component: ActionIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon: "Plus", "aria-label": "Agregar" },
} satisfies Meta<typeof ActionIcon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
