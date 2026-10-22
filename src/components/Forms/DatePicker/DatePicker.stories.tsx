import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';


const meta = {
  title: 'Components/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: "Fecha de inicio" },
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
