import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';


const meta = {
  title: 'Components/Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {  },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
