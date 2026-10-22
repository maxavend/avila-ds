import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';


const meta = {
  title: 'Components/DataDisplay/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {  },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
