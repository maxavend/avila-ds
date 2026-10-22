import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';


const meta = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
